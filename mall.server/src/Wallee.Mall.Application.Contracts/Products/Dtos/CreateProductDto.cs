using System;
using System.Collections.Generic;

namespace Wallee.Mall.Products.Dtos
{
    public class CreateProductDto
    {
        public string Name { get; set; } = default!;
        public string? Brand { get; set; }
        public string? ShortDescription { get; set; }
        // 商品默认价格（可被 SKU 覆盖）
        public decimal OriginalPrice { get; set; }

        /// <summary>
        /// 折扣率：1 = 不打折，0.7 = 7 折。
        /// </summary>
        public decimal DiscountRate { get; set; } = 1m;

        public List<Guid> ProductCovers { get; set; } = [];

        public int SortOrder { get; set; }
    }
}
