using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Application.Services;
using Volo.Abp.BackgroundJobs;
using Wallee.Mall.Medias.BackgroundJobs;
using Wallee.Mall.Products.Dtos;
using Wallee.Mall.Products.Pricing;

namespace Wallee.Mall.Products
{
    public class ProductAppService(
        IProductRepository repository,
        IBackgroundJobManager backgroundJobManager,
        IProductPriceSyncStrategy productPriceSyncStrategy)
        : CrudAppService<Product, ProductDto, Guid, ProductGetListInput, CreateProductDto, UpdateProductDto>(repository), IProductAppService
    {
        public override async Task<ProductDto> CreateAsync(CreateProductDto input)
        {
            if (await Repository.FindAsync(it => it.Name == input.Name) != null)
            {
                throw new UserFriendlyException("该产品已存在");
            }

            var entity = new Product(GuidGenerator.Create(), input.Name, input.OriginalPrice,
                input.DiscountRate, input.SortOrder, input.ProductCovers, input.Brand, input.ShortDescription);
            await Repository.InsertAsync(entity);
            return await MapToGetOutputDtoAsync(entity);
        }

        public override async Task<ProductDto> UpdateAsync(Guid id, UpdateProductDto input)
        {
            Product entity = await Repository.GetAsync(id);

            entity.Update(
                input.Name,
                input.OriginalPrice,
                input.DiscountRate,
                input.SortOrder,
                input.IsActive,
                input.ProductCovers,
                input.Brand,
                input.ShortDescription);

            var deletedCover = entity.ProductCovers.Select(it => it.MallMediaId).Except(input.ProductCovers);

            await CheckDeletedCoversAsync(deletedCover);

            await Repository.UpdateAsync(entity);

            return await MapToGetOutputDtoAsync(entity);

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
        }

        public async Task<List<ProductSkuDto>> GetSkusAsync(Guid id)
        {
            var product = await Repository.GetAsync(id);
            var skus = product.Skus?.OrderBy(s => s.SkuCode).ToList() ?? [];
            return [.. skus.Select(ObjectMapper.Map<ProductSku, ProductSkuDto>)];
        }

        public async Task<ProductDto> UpsertSkusAsync(Guid id, UpsertProductSkusDto input)
        {
            var product = await Repository.GetAsync(id);

            var codes = (input.Items ?? [])
                .Select(x => x.SkuCode)
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

                return new ProductSkuInput
                {
                    Id = skuId,
                    SkuCode = item.SkuCode,
                    OriginalPrice = item.OriginalPrice,
                    DiscountRate = item.DiscountRate,
                    JdPrice = item.JdPrice,
                    Currency = item.Currency,
                    StockQuantity = item.StockQuantity,
                    Attributes = attributes
                };
            }).ToList();

            product.UpsertSkus(skuInputs);

            var snapshot = await productPriceSyncStrategy.CalculateAsync(product);
            product.ApplyPriceSnapshot(snapshot);

            await Repository.UpdateAsync(product, autoSave: true);

            return await MapToGetOutputDtoAsync(product);
        }
    }
}
