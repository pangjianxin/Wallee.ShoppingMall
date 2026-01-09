using System;
using System.Collections.Generic;
using System.Linq;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;

namespace Wallee.Mall.Products
{
    public class Product : FullAuditedAggregateRoot<Guid>
    {
        private const int CurrencyDecimals = 2;

        public string Name { get; private set; } = default!;
        public string? Brand { get; private set; }
        public string? ShortDescription { get; private set; }

        // 商品默认价格（可被 SKU 覆盖）
        public decimal OriginalPrice { get; private set; }

        /// <summary>
        /// 商品折扣率：1 = 不打折，0.7 = 7 折。
        /// </summary>
        public decimal DiscountRate { get; private set; } = 1m;

        /// <summary>
        /// 京东参考价（仅用于展示/比价，不参与系统销售价计算）。
        /// </summary>
        public decimal? JdPrice { get; private set; }

        public string Currency { get; private set; } = "CNY";

        // 状态字段（便于筛选上架/下架商品）
        public bool IsActive { get; private set; } = true;

        // 排序权重（用于首页推荐、热销榜等）
        public int SortOrder { get; private set; } = 0;

        // 销量统计（冗余字段，便于排序，定期从订单同步）
        public int SalesCount { get; private set; } = 0;

        // 多对多标签
        public ICollection<ProductTag>? ProductTags { get; private set; }

        // 一对多 SKU
        public ICollection<ProductSku>? Skus { get; private set; }

        public ICollection<ProductCover> ProductCovers { get; private set; } = [];

        private Product()
        {
        }

        public Product(
            Guid id,
            string name,
            decimal originalPrice,
            decimal discountRate,
            int sortOrder,
            List<Guid> covers,
            string? brand = null,
            string? shortDescription = null) : base(id)
        {
            SetName(name);
            SetBrand(brand);
            SetShortDescription(shortDescription);
            SetOriginalPrice(originalPrice);
            SetDiscountRate(discountRate);
            SetSortOrder(sortOrder);
            ProductCovers = covers.ConvertAll(it => new ProductCover { MallMediaId = it });
        }

        public void Update(
            string name,
            decimal originalPrice,
            decimal discountRate,
            int sortOrder,
            bool isActive,
            List<Guid> productCovers,
            string? brand = null,
            string? shortDescription = null)
        {
            SetName(name);
            SetBrand(brand);
            SetShortDescription(shortDescription);
            SetOriginalPrice(originalPrice);
            SetDiscountRate(discountRate);
            SetSortOrder(sortOrder);
            SetActive(isActive);
            SetProductCovers(productCovers);
        }

        public void SetName(string name)
        {
            Name = name.Trim();
        }

        public void SetBrand(string? brand)
        {
            Brand = string.IsNullOrWhiteSpace(brand) ? null : brand.Trim();
        }

        public void SetShortDescription(string? shortDescription)
        {
            ShortDescription = string.IsNullOrWhiteSpace(shortDescription) ? null : shortDescription.Trim();
        }

        public void SetOriginalPrice(decimal price)
        {
            OriginalPrice = Check.Range(price, nameof(price), 0, decimal.MaxValue);
        }

        public void SetDiscountRate(decimal discountRate)
        {
            DiscountRate = Check.Range(discountRate, nameof(discountRate), 0.0001m, 1m);
        }

        public void SetJdPrice(decimal? price)
        {
            JdPrice = price;
        }

        public void SetCurrency(string currency)
        {
            Currency = string.IsNullOrWhiteSpace(currency) ? "CNY" : currency.Trim().ToUpperInvariant();
        }

        public void SetActive(bool isActive)
        {
            IsActive = isActive;
        }

        public void SetSortOrder(int sortOrder)
        {
            SortOrder = sortOrder;
        }

        public void SetProductCovers(List<Guid> productCovers)
        {
            ProductCovers = [.. productCovers.Select(it => new ProductCover { MallMediaId = it })];
        }

        public void IncrementSalesCount(int count = 1)
        {
            if (count < 0)
            {
                throw new ArgumentException("Count must be positive", nameof(count));
            }
            SalesCount += count;
        }

        public decimal GetSellingPrice()
        {
            return Math.Round(OriginalPrice * DiscountRate, CurrencyDecimals, MidpointRounding.AwayFromZero);
        }

        public ProductSku AddSku(Guid skuId, string skuCode, decimal originalPrice, decimal discountRate = 1m,
            decimal? jdPrice = null, string? currency = null, int stockQuantity = 0, Dictionary<string, string>? attributes = null)
        {
            Skus ??= new List<ProductSku>();

            skuCode = (skuCode ?? string.Empty).Trim();
            if (string.IsNullOrWhiteSpace(skuCode))
            {
                throw new ArgumentException("Sku code cannot be empty", nameof(skuCode));
            }

            if (Skus.Any(s => string.Equals(s.SkuCode, skuCode, StringComparison.OrdinalIgnoreCase)))
            {
                throw new BusinessException("Mall:SkuCodeAlreadyExists").WithData("SkuCode", skuCode);
            }

            var sku = new ProductSku(skuId, Id, skuCode, originalPrice);
            sku.SetDiscountRate(discountRate);
            sku.SetJdPrice(jdPrice);
            sku.SetCurrency(currency ?? Currency);
            sku.SetStock(stockQuantity);
            sku.SetAttributes(attributes);

            Skus.Add(sku);
            return sku;
        }

        public ProductSku UpdateSku(Guid skuId, string skuCode, decimal originalPrice, decimal discountRate,
            decimal? jdPrice, string? currency, int stockQuantity, Dictionary<string, string>? attributes)
        {
            var sku = FindSku(skuId);

            skuCode = (skuCode ?? string.Empty).Trim();
            if (string.IsNullOrWhiteSpace(skuCode))
            {
                throw new ArgumentException("Sku code cannot be empty", nameof(skuCode));
            }

            if (Skus!.Any(s => s.Id != skuId && string.Equals(s.SkuCode, skuCode, StringComparison.OrdinalIgnoreCase)))
            {
                throw new BusinessException("Mall:SkuCodeAlreadyExists").WithData("SkuCode", skuCode);
            }

            sku.SetSkuCode(skuCode);
            sku.SetOriginalPrice(originalPrice);
            sku.SetDiscountRate(discountRate);
            sku.SetJdPrice(jdPrice);
            sku.SetCurrency(currency ?? sku.Currency);
            sku.SetStock(stockQuantity);
            sku.SetAttributes(attributes);

            return sku;
        }

        public void RemoveSku(Guid skuId)
        {
            var sku = FindSku(skuId);
            Skus!.Remove(sku);
        }

        public ProductSku FindSku(Guid skuId)
        {
            if (Skus == null)
            {
                throw new BusinessException("Mall:SkuNotFound").WithData("SkuId", skuId);
            }

            var sku = Skus.FirstOrDefault(s => s.Id == skuId);
            if (sku == null)
            {
                throw new BusinessException("Mall:SkuNotFound").WithData("SkuId", skuId);
            }

            return sku;
        }
    }
}
