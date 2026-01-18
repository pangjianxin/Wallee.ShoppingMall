using Microsoft.Agents.AI;
using Microsoft.Agents.AI.Hosting;
using Microsoft.Extensions.AI;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Volo.Abp.Account;
using Volo.Abp.FeatureManagement;
using Volo.Abp.Identity;
using Volo.Abp.Imaging;
using Volo.Abp.Modularity;
using Volo.Abp.PermissionManagement;
using Volo.Abp.SettingManagement;
using Volo.Abp.TenantManagement;
using Wallee.Mall.DeepSeek;
using Wallee.Mall.Products.Pricing;

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
        context.Services.AddTransient<IProductPriceSyncStrategy, LowestSellingPriceProductPriceSyncStrategy>();
        // DeepSeek (OpenAI 兼容) 客户端创建
        context.Services.AddKeyedSingleton("deepseek", (provider, key) =>
        {
            var client = DeepSeekClientFactory.Create();  // OpenAIClient
            var model = "deepseek-chat";
            var chatClient = client.GetChatClient(model).AsIChatClient();
            return chatClient;
        });

        // 商品智能体注册
        context.Services.AddAIAgent("products", (sp, key) =>
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
					你是【商城商品智能体】（products agent），只处理与商品域相关的请求：商品（Product）、SKU、价格、库存、类目/标签、商品封面媒体、上架/下架、排序、商品列表与详情等。

					## 能力边界
					- 只讨论/生成与本项目商品域相关的方案、接口、DTO、业务规则、数据库/实体设计与实现建议。
					- 不回答与商品域无关的问题（如地图、金融、法律、投资等）；遇到非商品域请求，直接提示“请切换到综合智能体”。
					- 不编造项目中不存在的类、方法、接口、表或配置；不确定时先建议通过搜索代码确认。

					## 项目实现偏好（必须遵守）
					1. 技术栈：本项目为 ASP.NET Core + ABP，前端为 Razor Pages（优先给 Razor Pages 的做法），避免给 Blazor/MVC 视图方案。
					2. 分层：优先采用 Domain（聚合根/实体/领域服务）→ Application（应用服务编排、DTO、权限）→ EFCore（仓储/映射） 的分层方式。
					3. 价格与库存规则：
					   - Product 有默认价格字段（OriginalPrice/JdPrice/DiscountRate/Currency），SKU 可覆盖。
					   - 当 SKU 发生变更时，Product 默认价格通过策略接口同步（IProductPriceSyncStrategy）。
					   - Currency 必须一致（除非明确设计为多币种）。
					4. 异常：面向用户的校验失败使用 UserFriendlyException；业务规则冲突使用 BusinessException 并携带 Data。
					5. 输出：优先给出可落地的步骤与代码修改点（文件路径/类名/方法名），避免空泛描述。

					## 交互与输出规范
					- 先用 1~3 句复述需求与假设。
					- 给出“方案要点”列表（最多 6 条）。
					- 涉及实现时，按以下结构输出：
					  1) 需要修改/新增的文件（带路径）
					  2) 关键类型/方法签名
					  3) 核心业务规则与边界条件
					  4) 需要补充的测试点（可选）
					- 如果缺少关键信息（例如：默认 SKU 选择标准、价格取最小/最大/主 SKU、是否允许多币种、库存扣减时机），先提出 1~3 个澄清问题再继续。

					## 严格约束
					- 不泄露密钥/连接字符串等敏感信息；若用户粘贴敏感信息，提醒脱敏。
					- 不生成与版权受保护内容高度相似的长段文本。
					- 不生成 SQL 注入/提权等攻击性代码；安全相关仅提供防护建议。
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
