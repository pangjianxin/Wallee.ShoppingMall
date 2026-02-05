using System;
using System.Collections.Generic;
using System.Linq;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Wallee.Mall.Products.Strategy;
using Wallee.Mall.Utils;

namespace Wallee.Mall.Products
{
    public class Product : FullAuditedAggregateRoot<Guid>
    {
        public string Name { get; private set; } = default!;
        public string? Brand { get; private set; }
        public string? ShortDescription { get; private set; }
        // 状态字段（便于筛选上架/下架商品）
        public bool IsActive { get; private set; } = true;
        // 排序权重（用于首页推荐、热销榜等）
        public int SortOrder { get; private set; } = 0;
        // 销量统计（冗余字段，便于排序，定期从订单同步）
        public int SalesCount { get; private set; } = 0;

        #region 默认SKU信息快照
        /// <summary>
        /// 京东商品的SKUID
        /// </summary>
        public string? DefaultJdSkuId { get; set; } = default!;
        /// <summary>
        /// 京东参考价（仅用于展示/比价，不参与系统销售价计算）。
        /// </summary>
        public decimal? DefaultJdPrice { get; set; }
        /// <summary>
        /// 商品原价格（可被 SKU 覆盖）
        /// </summary>
        public decimal DefaultOriginalPrice { get; set; }
        /// <summary>
        /// SKU 折扣率：1 = 不打折，0.7 = 7 折。
        /// </summary>
        public decimal DefaultPrice { get; set; }
        /// <summary>
        /// 折扣信息
        /// </summary>
        public string DiscountText => DefaultPrice.ToDiscountText(DefaultOriginalPrice);
        #endregion

        // 一对多 SKU
        public ICollection<ProductSku>? Skus { get; private set; }

        public ICollection<ProductCover> ProductCovers { get; private set; } = [];

        private Product()
        {
        }

        public Product(
            Guid id,
            string name,
            int sortOrder,
            string? brand = null,
            string? shortDescription = null) : base(id)
        {
            SetName(name);
            SetSortOrder(sortOrder);
            SetBrand(brand);
            SetShortDescription(shortDescription);
        }

        public void Update(
            string name,
            int sortOrder,
            bool isActive,
            string? brand = null,
            string? shortDescription = null)
        {
            SetName(name);
            SetBrand(brand);
            SetShortDescription(shortDescription);
            SetSortOrder(sortOrder);
            SetActive(isActive);
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
            ProductCovers = productCovers.ConvertAll(it => new ProductCover { MallMediaId = it });
        }

        public void IncrementSalesCount(int count = 1)
        {
            if (count < 0)
            {
                throw new ArgumentException("Count must be positive", nameof(count));
            }
            SalesCount += count;
        }

        public void SetSkuSnapshot(ProductSkuSnapshot snapshot)
        {
            DefaultJdSkuId = snapshot.JdSkuId;
            DefaultJdPrice = snapshot.JdPrice;
            DefaultOriginalPrice = snapshot.OriginalPrice;
            DefaultPrice = snapshot.Price;
        }

        public void UpdateJdSkuPrice(IDictionary<string, decimal?> jdPrices)
        {
            if (jdPrices == null || jdPrices.Count == 0)
            {
                return;
            }

            Skus ??= [];

            foreach (var sku in Skus)
            {
                if (sku.JdSkuId != default)
                {
                    if (jdPrices.TryGetValue(sku.JdSkuId, out var jdPrice))
                    {
                        sku.SetJdPrice(jdPrice);
                    }
                }
            }
        }

        public void UpdateSkus(List<ProductUpdateSkuInput> inputs)
        {
            Skus ??= [];

            var inputById = inputs.ToDictionary(x => x.Id);
            var existingById = Skus.ToDictionary(x => x.Id);

            var removedSkus = Skus.Where(sku => !inputById.ContainsKey(sku.Id)).ToList();

            foreach (var sku in removedSkus)
            {
                Skus.Remove(sku);
            }

            foreach (var input in inputs)
            {
                if (existingById.TryGetValue(input.Id, out var sku))
                {
                    sku.SetJdSkuId(input.JdSkuId);
                    sku.SetOriginalPrice(input.OriginalPrice);
                    sku.SetPrice(input.Price);
                    sku.SetJdPrice(input.JdPrice);
                    sku.SetStock(input.StockQuantity);
                    sku.SetAttributes(input.Attributes ?? []);
                    continue;
                }

                Skus.Add(new ProductSku(
                    input.Id,
                    Id,
                    input.OriginalPrice,
                    input.Price,
                    input.StockQuantity,
                    input.JdSkuId,
                    input.JdPrice,
                    input.Attributes));
            }
        }
    }
}
