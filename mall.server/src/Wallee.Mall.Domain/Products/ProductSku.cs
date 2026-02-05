using System;
using System.Collections.Generic;
using System.Linq;
using Volo.Abp.Domain.Entities.Auditing;
using Wallee.Mall.Utils;

namespace Wallee.Mall.Products
{
    public class ProductSku : FullAuditedEntity<Guid>
    {
        public Guid ProductId { get; private set; }
        /// <summary>
        /// 系统设定原价
        /// </summary>
        public decimal OriginalPrice { get; private set; }
        /// <summary>
        /// 系统设定现价
        /// </summary>
        public decimal Price { get; private set; }
        /// <summary>
        /// 系统设定库存
        /// </summary>
        public int StockQuantity { get; private set; }
        public ICollection<ProductSkuAttribute> Attributes { get; private set; } = [];
        public string AttributesSignature { get; private set; } = string.Empty;
        /// <summary>
        /// 京东SKUID
        /// </summary>
        public string? JdSkuId { get; private set; }
        /// <summary>
        /// 京东参考价（仅用于展示/比价，不参与系统销售价计算）。
        /// </summary>
        public decimal? JdPrice { get; private set; }
        /// <summary>
        /// 获取折扣显示文本（如"8.5折"）
        /// </summary>
        /// <summary>
        /// 折扣信息
        /// </summary>
        public string DiscountText => Price.ToDiscountText(OriginalPrice);

        private ProductSku()
        {
        }

        public ProductSku(
            Guid id,
            Guid productId,
            decimal originalPrice,
            decimal price,
            int stockQuantity,
            string? jdSkuId,
            decimal? jdPrice,
            IEnumerable<ProductSkuAttribute>? attributes)
        {
            Id = id;
            ProductId = productId;
            SetJdSkuId(jdSkuId);
            SetOriginalPrice(originalPrice);
            SetPrice(price);
            SetJdPrice(jdPrice);
            SetStock(stockQuantity);
            SetAttributes([.. attributes ?? []]);
        }

        public void SetJdSkuId(string? jdSkuId)
        {
            JdSkuId = jdSkuId?.Trim();
        }

        public void SetPrice(decimal price)
        {
            Price = price.ValidatePrice().RoundMoney();
        }

        public void SetOriginalPrice(decimal price)
        {
            OriginalPrice = price.ValidatePrice().RoundMoney();
        }

        public void SetJdPrice(decimal? price)
        {
            JdPrice = price.HasValue ? price.Value.ValidatePrice().RoundMoney() : null;
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
            AttributesSignature = NormalizeAttributesSignature(Attributes);
        }

        public static string NormalizeAttributesSignature(IEnumerable<ProductSkuAttribute> attributes)
        {
            if (attributes == null)
            {
                return string.Empty;
            }

            return string.Join(string.Empty, attributes
                .Where(a => !string.IsNullOrWhiteSpace(a.Key))
                .Select(a => new { Key = a.Key.Trim(), Value = a.Value?.Trim() ?? string.Empty })
                .OrderBy(a => a.Key, StringComparer.OrdinalIgnoreCase)
                .ThenBy(a => a.Value, StringComparer.OrdinalIgnoreCase)
                .Select(a => $"{a.Key}:{a.Value};"));
        }
    }
}
