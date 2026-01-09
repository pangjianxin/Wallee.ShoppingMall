using Microsoft.Agents.AI;
using Microsoft.Agents.AI.Hosting;
using Microsoft.AspNetCore.Http.Json;
using Microsoft.Extensions.AI;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Volo.Abp.Account;
using Volo.Abp.FeatureManagement;
using Volo.Abp.Identity;
using Volo.Abp.Imaging;
using Volo.Abp.Modularity;
using Volo.Abp.PermissionManagement;
using Volo.Abp.SettingManagement;
using Volo.Abp.TenantManagement;
using Wallee.Mall.DeepSeek;
using Wallee.Mall.Hosted;
using Wallee.Mall.Mcp;

namespace Wallee.Mall;

[DependsOn(
    typeof(MallDomainModule),
    typeof(MallApplicationContractsModule),
    typeof(AbpPermissionManagementApplicationModule),
    typeof(AbpFeatureManagementApplicationModule),
    typeof(AbpIdentityApplicationModule),
    typeof(AbpAccountApplicationModule),
    typeof(AbpTenantManagementApplicationModule),
    typeof(AbpSettingManagementApplicationModule),
    typeof(AbpImagingImageSharpModule)
    )]
public class MallApplicationModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        // 缓存与 HostedService 预热 MCP 工具（用于不通过 HostedMcpServerTool 直接挂载工具）
        context.Services.AddSingleton<IMcpToolCache, McpToolCache>();
        context.Services.AddHostedService<McpToolPrefetchHostedService>();

        // DeepSeek (OpenAI 兼容) 客户端创建
        context.Services.AddKeyedSingleton("deepseek", (provider, key) =>
        {
            var client = DeepSeekClientFactory.Create();  // OpenAIClient
            var model = "deepseek-chat";
            return client.GetChatClient(model).AsIChatClient();
        });

        context.Services.AddAIAgent("amap", (sp, key) =>
        {
            var chatClient = sp.GetKeyedService<IChatClient>("deepseek");
            var amapToolsCache = sp.GetRequiredService<IMcpToolCache>();
            var config = sp.GetRequiredService<IConfiguration>();
            // 合理建议: TargetCount 取 15-30 (对话较长时降低上下文膨胀); Threshold 取 6-10 保持近似语境
            int targetCount = config.GetValue<int?>("AI:Comprehensive:TargetCount") ?? 20;
            int threshold = config.GetValue<int?>("AI:Comprehensive:Threshold") ?? 8;
            if (!amapToolsCache.Initialized)
            {
                amapToolsCache.InitializeAsync().GetAwaiter().GetResult();
            }
            var tools = amapToolsCache.Tools;
            // Get JsonSerializerOptions
            var jsonOptions = sp.GetRequiredService<IOptions<JsonOptions>>().Value;
            // 关键：必须把 hostedMcpTool 放进 Tools 列表才能触发远端 MCP Server 的工具发现 & 调用。
            var agent = chatClient!.CreateAIAgent(new ChatClientAgentOptions
            {
                Name = key,
                ChatOptions = new ChatOptions
                {
                    Instructions = @"
					你是一个结合高德地图 MCP 工具的智能体，仅处理与: 地理位置、POI 查询、周边搜索、地理/逆地理编码、路线规划(驾车/步行/骑行/公交)、天气、距离测量、导航唤醒、行程展示 相关的请求。
	
					严格规范: 
					1. 仅调用系统提供的工具名称，不要捏造不存在的工具。当前可用工具名称在你的系统上下文中(服务端已过滤)。	
					2. 当用户请求需要经纬度但只给了地址，先调用地理编码 (maps_geo)。	
					3. 经纬度统一使用 ""lng,lat"" (例如 116.39739,39.90873)，不要调换顺序。
					4. 如果缺少必要参数(例如 半径、起终点、城市等)，先向用户明确询问补充，不要盲目调用。
					5. 工具调用阶段仅输出函数调用所需内容，不要额外解释；得到结果后再进行结构化中文回答。
					6. 不要编造无法从工具结果中得出的信息。
					7. 多步：先解释行动计划(简短中文)，然后依序调用工具，一个问题尽量减少重复调用。
					8. 气象或周边场景若需城市编码但未知，尝试通过地理/逆地理编码获取。
					9. 用户明确要求生成导航/打车/行程可调用对应 schema 系列工具，结果 URI 直接返回。
					10. 回答使用简体中文，除非用户指定其他语言。
					11. 若问题超出地图/位置范畴，请提示用户使用综合智能体，并不要回答无关内容。",
                    Tools = [.. tools],

                },
                // 这里给工厂传入带 reducer 的 InMemoryChatMessageStore
                ChatMessageStoreFactory = ctx => new InMemoryChatMessageStore(
                    new SummarizingChatReducer(chatClient!, targetCount, threshold),
                    ctx.SerializedState,
                    ctx.JsonSerializerOptions)
            }, services: sp);

            return agent;
        });

        // 综合智能体：广泛领域回答，遇到强位置/地图需求时建议用户改用 amap 智能体。
        context.Services.AddAIAgent("comprehensive", (sp, key) =>
        {
            var chatClient = sp.GetKeyedService<IChatClient>("deepseek");
            var config = sp.GetRequiredService<IConfiguration>();
            // 合理建议: TargetCount 取 15-30 (对话较长时降低上下文膨胀); Threshold 取 6-10 保持近似语境
            int targetCount = config.GetValue<int?>("AI:Comprehensive:TargetCount") ?? 20;
            int threshold = config.GetValue<int?>("AI:Comprehensive:Threshold") ?? 8;

            return chatClient!.CreateAIAgent(new ChatClientAgentOptions
            {
                ChatOptions = new ChatOptions
                {
                    Instructions = @"
					你是一名资深银行及金融业务分析师与智能助手，擅长：
					- 银行业务策略、风险研判（信用风险、市场风险、流动性风险、操作风险、合规与声誉风险）
					- 财务/监管数据要点提炼与结构化总结
					- 复杂问题拆解、任务优先级规划、文案与报告撰写、代码与架构建议

					工作准则（严格遵守）:
					1. 风险分析输出结构：背景→关键指标/假设→风险点清单(按类型)→可能影响→应对建议(分短期/中期)。
					2. 所有涉及风险判断时：明确使用的假设与数据来源；未知数据以“(需确认: 项目)”标记，绝不臆造具体数值。
					3. 如用户请求定量评估而无足够数据：先列所需数据字段并提示获取路径，再给区间或方法而不是虚构结果。
					4. 涉及监管合规(如资本充足率、拨备覆盖率、风险暴露)时提醒遵循当地监管口径与最新指引；不提供法律、投资、审计的最终意见，需免责声明。
					5. 不泄露敏感/个人数据；若用户粘贴疑似敏感内容，提示脱敏处理与访问控制。
					6. 不引用未明确可信来源的传闻；对不确定信息使用“可能”“需验证”并给出验证渠道。
					8. 优先使用简体中文；若用户使用其他语言，则跟随其语言。专业术语首用时附括号英文或缩写 (如: 流动性覆盖率(LCR))。
					9. 长回答需分节、编号或使用要点列表；超 20 行时给执行概要。可用 Markdown 结构化。（禁止过度华丽辞藻）。
					10. 用户意图不清时，先用 1~2 句澄清问题所需的范围、时间跨度、数据维度或目标指标。
					11. 不虚构引用文献或法规编号；如需参考，请建议查询官方监管文件或行内制度库。
					12. 如请求预测：明确为情景分析/假设推演，不给绝对确定结论，并列核心敏感因子。
					13. 面对多任务请求：先列任务拆解顺序与依赖，再逐项回答。
					14. 输出中不使用“我是模型”类措辞，保持专业分析师口吻。

					响应格式建议（根据场景自适应）：
					- 风险评估：
					  ```markdown
					  ## 风险概览
					  **结论速览**: <核心一句>
					  ## 关键假设
					  - ...
					  ## 风险类型分析
					  ### 信用风险
					  - 触发因素 …
					  ### 市场风险
					  - …
					  ## 影响与量级(若数据不足则列需确认项)
					  ## 建议措施
					  - 短期 (0-3月): …
					  - 中期 (3-12月): …
					  ## 后续数据采集清单
					  ```
					- 报告/总结：执行摘要 → 主题分节 → 要点列表 → 后续行动。
					- 代码建议：场景说明 → 方案对比表 → 推荐实现片段 → 潜在扩展/风险点。

					如果用户输入仅为问候或极短文本，先确认其需求类型（风险分析 / 数据指标 / 项目规划 / 技术实现 / 其他）。
					务必确保回答真实、透明、可审计。
					",
                },
                Name = key,
                // 这里给工厂传入带 reducer 的 InMemoryChatMessageStore
                ChatMessageStoreFactory = ctx => new InMemoryChatMessageStore(
                    new SummarizingChatReducer(chatClient!, targetCount, threshold),
                    ctx.SerializedState,
                    ctx.JsonSerializerOptions)
            }, services: sp);
        });
    }
}
