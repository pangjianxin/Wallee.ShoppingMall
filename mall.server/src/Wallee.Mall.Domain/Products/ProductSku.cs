using System;
using System.Collections.Generic;
using Volo.Abp.Domain.Entities.Auditing;

namespace Wallee.Mall.Products
{
    public class ProductSku : FullAuditedEntity<Guid>
    {
        public Guid ProductId { get; private set; }
        public string SkuCode { get; private set; } = default!;
        public decimal OriginalPrice { get; private set; }
        public decimal? DiscountPrice { get; private set; }
        public decimal? JdPrice { get; private set; }
        public string Currency { get; private set; } = "CNY";
        public int StockQuantity { get; private set; }
        public Dictionary<string, string> Attributes { get; private set; } = new(StringComparer.OrdinalIgnoreCase);

        public Product Product { get; private set; } = default!;

        private ProductSku()
        {
        }

        public ProductSku(Guid id, Guid productId, string skuCode, decimal originalPrice)
        {
            Id = id;
            ProductId = productId;
            SetSkuCode(skuCode);
            SetOriginalPrice(originalPrice);
        }

        public void SetSkuCode(string skuCode)
        {
            if (string.IsNullOrWhiteSpace(skuCode))
            {
                throw new ArgumentException("Sku code cannot be empty", nameof(skuCode));
            }

            SkuCode = skuCode.Trim();
        }

        public void SetOriginalPrice(decimal price)
        {
            OriginalPrice = ValidatePrice(price);
        }

        public void SetDiscountPrice(decimal? price)
        {
            DiscountPrice = price.HasValue ? ValidatePrice(price.Value) : null;
        }

        public void SetJdPrice(decimal? price)
        {
            JdPrice = price.HasValue ? ValidatePrice(price.Value) : null;
        }

        public void SetCurrency(string currency)
        {
            Currency = string.IsNullOrWhiteSpace(currency) ? "CNY" : currency.Trim().ToUpperInvariant();
        }

        public void SetStock(int quantity)
        {
            if (quantity < 0)
            {
                throw new ArgumentException("Stock cannot be negative", nameof(quantity));
            }

            StockQuantity = quantity;
        }

        public void AdjustStock(int delta)
        {
            var newValue = StockQuantity + delta;
            if (newValue < 0)
            {
                throw new ArgumentException("Stock cannot be negative after adjustment", nameof(delta));
            }

            StockQuantity = newValue;
        }

        public void SetAttributes(Dictionary<string, string> attributes)
        {
            Attributes = attributes == null
                ? new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
                : new Dictionary<string, string>(attributes, StringComparer.OrdinalIgnoreCase);
        }

        public decimal GetEffectivePrice()
        {
            // 优先 SKU 价，再回落商品价
            return DiscountPrice ?? OriginalPrice;
        }

        private static decimal ValidatePrice(decimal price)
        {
            if (price < 0)
            {
                throw new ArgumentException("Price cannot be negative", nameof(price));
            }

            return price;
        }
    }
}
