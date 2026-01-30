using System;
using System.Collections.Generic;

namespace Wallee.Mall.Products
{
    public class ProductSkuInput
    {
        public Guid Id { get; set; }
        public string JdSkuId { get; set; } = default!;
        public decimal OriginalPrice { get; set; }
        public decimal Price { get; set; } = 1m;
        public decimal? JdPrice { get; set; }
        public int StockQuantity { get; set; }
        public List<ProductSkuAttribute> Attributes { get; set; } = [];
    }
}
