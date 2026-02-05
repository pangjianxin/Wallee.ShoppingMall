using System;
using Volo.Abp.BackgroundJobs;

namespace Wallee.Mall.Products.BackgroundJobs
{
    [BackgroundJobName("通过商品Id获取京东商品信息")]
    public class UpdateJdSkuJobArgs
    {
        public Guid ProductId { get; set; }
    }
}
