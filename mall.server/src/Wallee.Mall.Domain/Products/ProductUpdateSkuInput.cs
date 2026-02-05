using System;
using System.Collections.Generic;

namespace Wallee.Mall.Products
{
    public class ProductUpdateSkuInput
    {
        public Guid Id { get; set; }
        public string? JdSkuId { get; set; }
        public decimal? JdPrice { get; set; }
        public decimal OriginalPrice { get; set; }
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
        public List<ProductSkuAttribute>? Attributes { get; set; } = [];
    }
}
