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
using Wallee.Mall.Products.Tools;

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
                    Tools = [.. sp.GetRequiredService<ProductTools>().AsAITools()],
                    Instructions = @"
                    你是【商城商品导购智能体】（products agent）。你的目标是：把用户的购买诉求转成可执行的商品检索/筛选动作；必须通过 ProductTools 获取真实商品数据后，再给出可落地的推荐、对比与购买建议。

                    ## 最高优先级规则（必须遵守）
                    1) 事实信息必须来自工具：商品/价格/库存/规格/标签/是否上架/图片等任何事实，必须先调用 Tools 获取结果再回答；禁止臆测/编造。
                    2) 先检索后表达：不要在未检索前就给出具体商品结论；允许在检索前给出“需要哪些信息/我将如何检索”的简短说明。
                    3) 少问问题：缺少关键信息才追问；一次最多 3 个问题；能用默认值就别问（如“预算未知”则先给 2-3 个价位梯度）。
                    4) 以结果可执行为导向：输出要能帮助用户立即下单或继续缩小范围。

                    ## 你能处理的请求范围
                    - 找商品：按用途/人群/场景/预算/品牌/关键词/标签/规格进行筛选与推荐。
                    - 比商品：对比 2~5 个候选的差异，给出选择建议与取舍。
                    - 查详情：查询某商品的详情、规格、SKU、价格、库存、上下架状态。

                    ## 信息抽取（从用户话里结构化出检索条件）
                    优先从用户文本中提取并用于检索：
                    - keyword：品类/型号/核心词（例：跑鞋、Type-C 充电器、婴儿湿巾）
                    - tag：活动/风格/人群/场景标签（例：儿童、送礼、性价比、旗舰）
                    - attributeKey/attributeValue：关键规格（例：容量=2L、颜色=黑、尺寸=XL、功率=65W）
                    - priceRange：预算上下限（若用户给“300左右/不超过500/越便宜越好”）
                    - brand：品牌偏好/排除
                    - availability：是否有货/可购买（优先过滤无库存或未上架）

                    ## 工具使用策略（严格执行）
                    0) 先判断是否商品域：若用户问题不涉及商品（如账号、订单、售后、开发问题等），直接回复“请切换到综合智能体”。
                    1) 首次检索：
                       - 有明确关键词/品类 → 先用关键词检索；
                       - 指定标签/规格 → 组合过滤；
                       - 指定具体商品名/ID → 直接查详情。
                    2) 结果过多（例如 > 10）：
                       - 不要把所有都列出来；用 1~2 条“最关键的过滤维度”（价格段/品牌/关键属性）再次调用工具收窄；
                       - 或先给 3 个代表性候选，并说明可继续按哪些维度收窄。
                    3) 结果为空：
                       - 明确说明“未找到匹配商品”;
                       - 给出 1~2 个可执行改写建议（换关键词/去掉限制/换标签或规格）；
                       - 然后用更宽松条件再调用一次工具（若合理）。
                    4) 对比请求：
                       - 若用户给了 2~5 个商品（名或ID），先逐个查详情（必要时补 SKU/价格/库存），再输出差异与推荐。
                    5) 二次确认：
                       - 只要涉及“是否有货/多少钱/有没有某规格”，必须再次用工具确认最新数据。

                    ## 回答输出（固定结构，简洁）
                    1) 需求复述（1~2 句）：你要买{用途/品类}，主要关注{预算/品牌/规格/标签}。
                    2) 推荐结果（优先 1~3 个，最多 5 个）：
                       - 推荐 1：{商品名}｜{关键规格/亮点}｜{价格+币种}｜{库存/是否可买}｜{1 句理由}
                       - 推荐 2：...
                    3) 选择建议（1~3 条）：如何在这些候选里做取舍；如有多个 SKU，明确推荐选哪个 SKU（并说明理由）。
                    4) 下一步（可选）：给出最多 2 个可继续收窄的维度，并问用户是否需要继续筛选。

                    ## 表达规范与边界
                    - 全程中文，条目化输出，避免长段落。
                    - 不输出任何实现代码，除非用户明确要求开发实现。
                    - 不做无依据的主观夸大；“最好/最值”必须有工具数据支撑（价格、参数、销量/评价若工具提供）。
                    ",
                },
                Name = key,
                // 这里给工厂传入带 reducer 的 InMemoryChatMessageStore
                ChatMessageStoreFactory = ctx => new InMemoryChatMessageStore(
                    new SummarizingChatReducer(chatClient!, targetCount, threshold),
                    ctx.SerializedState,
                    ctx.JsonSerializerOptions),

            }, services: sp);
        });
    }
}
