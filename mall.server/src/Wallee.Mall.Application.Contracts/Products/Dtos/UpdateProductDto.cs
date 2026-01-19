using System;
using System.Collections.Generic;

namespace Wallee.Mall.Products.Dtos
{
    public class UpdateProductDto
    {
        public string Name { get; set; } = default!;
        public string? Brand { get; set; }
        public string? ShortDescription { get; set; }
        // 商品默认价格（可被 SKU 覆盖）
        public decimal OriginalPrice { get; set; }
        //京东参考价价格
        public decimal? JdPrice { get; set; }
        public bool IsActive { get; set; } = true;
        /// <summary>
        /// 折扣率：1 = 不打折，0.7 = 7 折。
        /// </summary>
        public decimal DiscountRate { get; set; } = 1m;
        public int SortOrder { get; set; }
        public List<Guid> ProductCovers { get; set; } = [];
    }
}
