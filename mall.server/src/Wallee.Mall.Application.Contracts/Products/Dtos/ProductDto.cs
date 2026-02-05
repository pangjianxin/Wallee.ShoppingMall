using System;
using System.Collections.Generic;
using Volo.Abp.Application.Dtos;
using Wallee.Mall.Utils;

namespace Wallee.Mall.Products.Dtos
{
    public class ProductDto : AuditedEntityDto<Guid>
    {
        public string Name { get; set; } = default!;
        public string? Brand { get; set; }
        public string? ShortDescription { get; set; }
        // 状态字段（便于筛选上架/下架商品）
        public bool IsActive { get; set; } = true;
        // 排序权重（用于首页推荐、热销榜等）
        public int SortOrder { get; set; } = 0;
        // 销量统计（冗余字段，便于排序，定期从订单同步）
        public int SalesCount { get; set; } = 0;
        // 一对多 SKU
        public List<ProductSkuDto>? Skus { get; set; }
        public List<ProductCoverDto> ProductCovers { get; set; } = [];

        /// <summary>
        /// 京东商品的SKUID
        /// </summary>
        public string? DefaultJdSkuId { get; set; } = default!;
        /// <summary>
        /// 京东参考价（仅用于展示/比价，不参与系统销售价计算）。
        /// </summary>
        public decimal? DefaultJdPrice { get; set; }
        /// <summary>
        /// 商品原价格（可被 SKU 覆盖）
        /// </summary>
        public decimal DefaultOriginalPrice { get; set; }
        /// <summary>
        /// SKU 折扣率：1 = 不打折，0.7 = 7 折。
        /// </summary>
        public decimal DefaultPrice { get; set; }
        /// <summary>
        /// 折扣信息
        /// </summary>
        public string DiscountText { get; set; } = default!;
    }
}
