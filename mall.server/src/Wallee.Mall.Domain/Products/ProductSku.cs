using System;
using System.Collections.Generic;
using Volo.Abp.Domain.Entities.Auditing;
using Wallee.Mall.Utils;

namespace Wallee.Mall.Products
{
    public class ProductSku : FullAuditedEntity<Guid>
    {
        public Guid ProductId { get; private set; }
        public string SkuCode { get; private set; } = default!;
        public decimal OriginalPrice { get; private set; }
        /// <summary>
        /// SKU 折扣率：1 = 不打折，0.7 = 7 折。
        /// </summary>
        public decimal DiscountRate { get; private set; } = 1m;

        /// <summary>
        /// 京东参考价（仅用于展示/比价，不参与系统销售价计算）。
        /// </summary>
        public decimal? JdPrice { get; private set; }

        public string Currency { get; private set; } = "CNY";
        public int StockQuantity { get; private set; }
        public ICollection<ProductSkuAttribute> Attributes { get; private set; } = [];

        private ProductSku()
        {
        }

        public ProductSku(
            Guid id,
            Guid productId,
            string skuCode,
            decimal originalPrice,
            decimal discountRate,
            decimal? jdPrice,
            string currency,
            int StockQuantity,
            IEnumerable<ProductSkuAttribute> attributes)
        {
            Id = id;
            ProductId = productId;
            SetSkuCode(skuCode);
            SetOriginalPrice(originalPrice);
            SetDiscountRate(discountRate);
            SetJdPrice(jdPrice);
            SetCurrency(currency);
            SetStock(StockQuantity);
            SetAttributes([.. attributes]);
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
            OriginalPrice = price.ValidatePrice().RoundMoney();
        }

        public void SetDiscountRate(decimal discountRate)
        {
            if (discountRate <= 0)
            {
                throw new ArgumentException("Discount rate must be greater than 0", nameof(discountRate));
            }

            if (discountRate > 1)
            {
                throw new ArgumentException("Discount rate cannot be greater than 1", nameof(discountRate));
            }

            DiscountRate = discountRate;
        }

        public void ResetDiscount()
        {
            DiscountRate = 1m;
        }

        public void SetJdPrice(decimal? price)
        {
            JdPrice = price.HasValue ? price.Value.ValidatePrice().RoundMoney() : null;
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

        public void SetAttributes(List<ProductSkuAttribute>? attributes)
        {
            Attributes = attributes ?? [];
        }

        public decimal GetSellingPrice()
        {
            return (OriginalPrice * DiscountRate).RoundMoney();
        }
    }
}
