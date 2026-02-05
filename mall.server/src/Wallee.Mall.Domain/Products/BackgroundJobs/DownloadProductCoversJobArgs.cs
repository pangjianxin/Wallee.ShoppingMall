using System;
using System.Collections.Generic;
using Volo.Abp.BackgroundJobs;

namespace Wallee.Mall.Products.BackgroundJobs
{
    [BackgroundJobName("下载商品封面")]
    public class DownloadProductCoversJobArgs
    {
        public Guid ProductId { get; set; }
        public List<string> ImageUrls { get; set; } = [];
        public int RetryCount { get; set; }
    }
}
