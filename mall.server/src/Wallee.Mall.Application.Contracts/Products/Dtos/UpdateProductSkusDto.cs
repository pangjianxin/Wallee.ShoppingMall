using System;
using System.Collections.Generic;

namespace Wallee.Mall.Products.Dtos
{
    public class UpdateProductSkuDto
    {
        public Guid? Id { get; set; }
        public string JdSkuId { get; set; } = default!;
        public decimal OriginalPrice { get; set; }
        /// <summary>
        /// SKU 折扣率：1 = 不打折，0.7 = 7 折。
        /// </summary>
        public decimal Price { get; set; }
        /// <summary>
        /// 京东参考价（仅用于展示/比价，不参与系统销售价计算）。
        /// </summary>
        public decimal? JdPrice { get; set; }
        public int StockQuantity { get; set; }
        public List<ProductSkuAttributeDto> Attributes { get; set; } = [];
    }

    public class UpdateProductSkusDto
    {
        public List<UpdateProductSkuDto> Items { get; set; } = [];
    }
}
