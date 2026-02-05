using Volo.Abp.BackgroundJobs;

namespace Wallee.Mall.Products.BackgroundJobs
{
    [BackgroundJobName("通过JdSkuId获取商品信息")]
    public class CreateProductByJdSkuJobArgs
    {
        public string JdSkuId { get; set; } = string.Empty;
    }
}
