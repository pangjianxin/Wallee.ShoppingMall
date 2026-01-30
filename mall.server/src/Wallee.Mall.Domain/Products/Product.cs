using System;
using System.Collections.Generic;
using System.Linq;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Wallee.Mall.Products.Strategy;

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

        public ProductSkuSnapshot? SkuSnapshot { get; set; }

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

        public void SetSkuSnapshot(ProductSkuSnapshot? snapshot)
        {
            SkuSnapshot = snapshot;
        }

        public void UpsertSkus(List<ProductSkuInput> inputs)
        {
            Skus ??= [];
            inputs ??= [];

            // 校验：SkuCode 不能为空
            if (inputs.Any(x => string.IsNullOrWhiteSpace(x?.JdSkuId)))
            {
                throw new ArgumentException("Sku code cannot be empty", nameof(inputs));
            }

            // 校验：Id 不能为空
            if (inputs.Any(x => x.Id == Guid.Empty))
            {
                throw new ArgumentException("Sku id cannot be empty for upsert.", nameof(inputs));
            }

            // 校验：本次提交内 SkuCode 不重复（忽略大小写）
            var duplicatedCode = inputs
                .Select(x => x.JdSkuId.Trim())
                .GroupBy(x => x, StringComparer.OrdinalIgnoreCase)
                .Where(g => g.Count() > 1)
                .Select(g => g.Key)
                .FirstOrDefault();

            if (duplicatedCode != null)
            {
                throw new BusinessException("Mall:SkuCodeAlreadyExists").WithData("SkuCode", duplicatedCode);
            }

            var inputById = inputs.ToDictionary(x => x.Id);

            var existingIds = Skus.Select(x => x.Id).ToHashSet();
            var inputIds = inputById.Keys.ToHashSet();

            var toRemove = existingIds.Except(inputIds).ToList();
            var toUpdate = existingIds.Intersect(inputIds).ToList();
            var toAdd = inputIds.Except(existingIds).ToList();

            foreach (var id in toRemove)
            {
                var existing = Skus.First(x => x.Id == id);
                Skus.Remove(existing);
            }

            foreach (var id in toUpdate)
            {
                var existing = Skus.First(x => x.Id == id);
                var input = inputById[id];
                existing.SetJdSkuId(input.JdSkuId);
                existing.SetOriginalPrice(input.OriginalPrice);
                existing.SetJdPrice(input.JdPrice);
                existing.SetStock(input.StockQuantity);
                existing.SetAttributes(input.Attributes);
            }

            foreach (var id in toAdd)
            {
                var input = inputById[id];

                var sku = new ProductSku(
                    input.Id,
                    Id,
                    input.JdSkuId,
                    input.OriginalPrice,
                    input.Price,
                    input.JdPrice,
                    input.StockQuantity,
                    input.Attributes);

                Skus.Add(sku);
            }
        }
    }
}
