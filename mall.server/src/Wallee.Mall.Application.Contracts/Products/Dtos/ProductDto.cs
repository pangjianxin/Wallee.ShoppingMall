using System;
using System.Collections.Generic;
using Volo.Abp.Application.Dtos;

namespace Wallee.Mall.Products.Dtos
{
    public class ProductDto : AuditedEntityDto<Guid>
    {
        public string Name { get; set; } = default!;
        public string? Brand { get; set; }
        public string? ShortDescription { get; set; }
        // 商品默认价格（可被 SKU 覆盖）
        public decimal? OriginalPrice { get; set; }
        public decimal? JdPrice { get; set; }
        /// <summary>
        /// 折扣率：1 = 不打折，0.7 = 7 折。
        /// </summary>
        public decimal DiscountRate { get; set; } = 1m;
        public string? Currency { get; set; } = "CNY";
        // 状态字段（便于筛选上架/下架商品）
        public bool IsActive { get; set; } = true;
        // 排序权重（用于首页推荐、热销榜等）
        public int SortOrder { get; set; } = 0;
        // 销量统计（冗余字段，便于排序，定期从订单同步）
        public int SalesCount { get; set; } = 0;
        // 一对多 SKU
        public List<ProductSkuDto>? Skus { get; set; }
        public List<ProductCoverDto> ProductCovers { get; set; } = [];
    }
}
