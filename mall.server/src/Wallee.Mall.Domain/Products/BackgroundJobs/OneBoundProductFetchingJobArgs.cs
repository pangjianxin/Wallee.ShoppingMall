using System;
using Volo.Abp.BackgroundJobs;

namespace Wallee.Mall.Products.BackgroundJobs
{
    [BackgroundJobName("从万邦平台获取商品信息")]
    public class OneBoundProductFetchingJobArgs
    {
        public Guid ProductId { get; set; }
        public string NumIid { get; set; } = string.Empty;
    }
}
