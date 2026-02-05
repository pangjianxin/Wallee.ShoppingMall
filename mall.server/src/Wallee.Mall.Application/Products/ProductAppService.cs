using AutoFilterer.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Application.Services;
using Volo.Abp.BackgroundJobs;
using Wallee.Mall.Medias.BackgroundJobs;
using Wallee.Mall.Products.BackgroundJobs;
using Wallee.Mall.Products.Dtos;
using Wallee.Mall.Products.Strategy;

namespace Wallee.Mall.Products
{
    public class ProductAppService(
        IProductRepository repository,
        IBackgroundJobManager backgroundJobManager,
        IProductSkuSnapshotSyncStrategy productSkuSnapshotSyncStrategy)
        : CrudAppService<Product, ProductDto, Guid, ProductGetListInput, CreateProductDto, UpdateProductDto>(repository), IProductAppService
    {
        public override async Task<ProductDto> CreateAsync(CreateProductDto input)
        {
            if (await Repository.FindAsync(it => it.Name == input.Name) != null)
            {
                throw new UserFriendlyException("该产品已存在");
            }

            var entity = new Product(GuidGenerator.Create(), input.Name, input.SortOrder, input.Brand, input.ShortDescription);

            await Repository.InsertAsync(entity);

            return await MapToGetOutputDtoAsync(entity);
        }

        public async Task CreateByJdSkuAsync(CreateProductByJdSkuDto input)
        {
            await backgroundJobManager.EnqueueAsync(new CreateProductByJdSkuJobArgs
            {
                JdSkuId = input.JdSkuId
            });
        }

        public async Task<ProductDto> UpdateCoversAsync(Guid id, UpdateProductCoversDto input)
        {
            Product entity = await repository.GetAsync(id);

            var deletedCover = entity.ProductCovers.Select(it => it.MallMediaId).Except(input.ProductCovers);

            entity.SetProductCovers(input.ProductCovers);

            await CheckDeletedCoversAsync(deletedCover);

            async Task CheckDeletedCoversAsync(IEnumerable<Guid> deletedCover)
            {
                if (deletedCover.Any())
                {
                    await backgroundJobManager.EnqueueAsync(new BatchDeleteMediaJobArgs
                    {
                        MediaIds = [.. deletedCover]
                    },
                     delay: TimeSpan.FromSeconds(5));
                }
            }

            await repository.UpdateAsync(entity);

            return await MapToGetOutputDtoAsync(entity);
        }

        public override async Task<ProductDto> UpdateAsync(Guid id, UpdateProductDto input)
        {
            Product entity = await Repository.GetAsync(id);

            entity.Update(
                input.Name,
                input.SortOrder,
                input.IsActive,
                input.Brand,
                input.ShortDescription);

            await Repository.UpdateAsync(entity);
            return await MapToGetOutputDtoAsync(entity);
        }

        public async Task<List<ProductSkuDto>> GetSkusAsync(Guid id)
        {
            var product = await Repository.GetAsync(id);
            var skus = product.Skus?.OrderBy(s => s.JdSkuId).ToList() ?? [];
            return [.. skus.Select(ObjectMapper.Map<ProductSku, ProductSkuDto>)];
        }

        public async Task<ProductDto> UpdateSkusAsync(Guid id, UpdateProductSkusDto input)
        {
            var product = await repository.GetAsync(id);

            var codes = (input.Items ?? [])
                .Select(x => x.JdSkuId)
                .Where(x => !string.IsNullOrWhiteSpace(x))
                .Select(x => x.Trim())
                .ToList();

            var duplicated = codes
                .GroupBy(x => x, StringComparer.OrdinalIgnoreCase)
                .Where(g => g.Count() > 1)
                .Select(g => g.Key)
                .FirstOrDefault();

            if (duplicated != null)
            {
                throw new UserFriendlyException($"SkuCode 重复：{duplicated}");
            }

            var items = input.Items ?? [];

            var skuInputs = items.Select(item =>
            {
                var skuId = item.Id ?? GuidGenerator.Create();

                var attributes = item.Attributes != null
                    ? item.Attributes.Select(static it => new ProductSkuAttribute(it.Key, it.Value)).ToList()
                    : [];

                return new ProductUpdateSkuInput
                {
                    Id = skuId,
                    JdSkuId = item.JdSkuId,
                    OriginalPrice = item.OriginalPrice,
                    Price = item.Price,
                    JdPrice = item.JdPrice,
                    StockQuantity = item.StockQuantity,
                    Attributes = attributes
                };
            }).ToList();

            product.UpdateSkus(skuInputs);

            var snapshot = product.Skus != null && product.Skus.Count > 0
                ? await productSkuSnapshotSyncStrategy.CalculateAsync(product.Skus)
                : new ProductSkuSnapshot(product.DefaultJdSkuId, product.DefaultJdPrice, product.DefaultOriginalPrice, product.DefaultPrice);

            product.SetSkuSnapshot(snapshot);

            await repository.UpdateAsync(product, autoSave: true);

            return await MapToGetOutputDtoAsync(product);
        }

        protected override async Task<IQueryable<Product>> CreateFilteredQueryAsync(ProductGetListInput input)
        {
            return (await base.CreateFilteredQueryAsync(input)).ApplyFilter(input);
        }
    }
}
