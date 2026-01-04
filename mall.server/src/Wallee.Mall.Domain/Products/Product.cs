using System;
using System.Collections.Generic;
using System.Text;
using Volo.Abp.Domain.Entities.Auditing;

namespace Wallee.Mall.Products
{
    public class Product : FullAuditedAggregateRoot<Guid>
    {
        public string Name { get; private set; } = default!;
        public string? Brand { get; private set; }
        public string? ShortDescription { get; private set; }

        // 商品默认价格（可被 SKU 覆盖）
        public decimal OriginalPrice { get; private set; }
        public decimal? DiscountPrice { get; private set; }
        public decimal? JdPrice { get; private set; }
        public string Currency { get; private set; } = "CNY";

        // 多对多标签
        public ICollection<ProductTag> ProductTags { get; private set; } = new List<ProductTag>();

        // 一对多 SKU
        public ICollection<ProductSku> Skus { get; private set; } = new List<ProductSku>();

        private Product()
        {
        }

        public Product(Guid id, string name, decimal originalPrice, string? brand = null, string? shortDescription = null)
        {
            Id = id;
            SetName(name);
            SetBrand(brand);
            SetShortDescription(shortDescription);
            SetOriginalPrice(originalPrice);
        }

        public void SetName(string name)
        {
            Name = Normalize(name);
        }

        public void SetBrand(string? brand)
        {
            Brand = string.IsNullOrWhiteSpace(brand) ? null : Normalize(brand);
        }

        public void SetShortDescription(string? shortDescription)
        {
            ShortDescription = string.IsNullOrWhiteSpace(shortDescription) ? null : shortDescription.Trim();
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

        public decimal GetEffectivePrice()
        {
            return DiscountPrice ?? JdPrice ?? OriginalPrice;
        }

        private static string Normalize(string value)
        {
            return value.Trim();
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
