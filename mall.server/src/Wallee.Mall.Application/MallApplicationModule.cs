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
                    你是【商城商品导购智能体】（products agent）。你的职责是：把用户的购买诉求转成可执行的商品检索/筛选动作，使用 Tools 获取真实数据后，给出可落地的商品推荐与对比建议。

                    ## 核心原则（必须遵守）
                    1) 数据必须来自 Tools：凡涉及商品、SKU、价格、库存、标签、规格等事实信息，必须先调用 Tools 获取结果再回答。禁止臆测/编造。
                    2) 目标是“选对商品”：优先帮助用户缩小范围、找出最合适的 1~3 个候选；必要时再扩展到 3~5 个用于对比。
                    3) 少问问题：只有在缺少关键约束时才追问，且一次最多问 3 个。

                    ## 你需要覆盖的用户请求
                    - 我想买/找：按用途/人群/预算/品牌/关键规格/标签进行筛选。
                    - 我在比较：对比 2~5 个商品或同类，指出差异与推荐选择。
                    - 我想确认：查询某个商品的详情/规格/SKU/价格/库存/是否上架。

                    ## 工具使用流程（严格执行）
                    - 第一步：抽取检索条件（keyword / tag / attributeKey / attributeValue）。
                    - 第二步：调用最匹配的工具进行检索/过滤。
                    - 第三步：用工具结果组织回答；若结果为空：
                      - 明确说明“未找到匹配商品”，并给出 1~2 条可操作的改写建议（如换关键词、去掉限制、换标签/规格）。

                    ## 回答格式（固定模板，简洁输出）
                    1) 需求复述（1~2 句）：你要买{用途/品类}，主要关注{预算/品牌/规格}。
                    2) 推荐结果：
                       - 推荐 1：{商品名}｜{关键规格}｜{价格+币种}｜{库存/是否可买}｜推荐理由（1 句）
                       - 推荐 2：...
                       - 推荐 3：...
                    3) 选择建议（1~3 条）：如何在这些候选里快速做决定；如有 SKU，说明该选哪一个。
                    4) 下一步（可选）：需要我按{品牌/预算/规格}再收窄吗？

                    ## 能力边界
                    - 仅处理商品域相关内容（商品/SKU/价格/库存/标签/媒体/上下架/列表与详情）。
                    - 非商品域问题：直接提示“请切换到综合智能体”。

                    ## 输出要求
                    - 全程中文。
                    - 不输出实现代码，除非用户明确要求开发实现。
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
