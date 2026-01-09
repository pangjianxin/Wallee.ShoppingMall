using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Application.Services;
using Volo.Abp.BackgroundJobs;
using Wallee.Mall.Medias.BackgroundJobs;
using Wallee.Mall.Products.Dtos;

namespace Wallee.Mall.Products
{
    public class ProductAppService(IProductRepository repository, IBackgroundJobManager backgroundJobManager)
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

        public async Task<List<ProductSkuDto>> GetSkusAsync(Guid productId)
        {
            var product = await LoadProductWithSkusAsync(productId);
            var skus = product.Skus?.OrderBy(s => s.SkuCode).ToList() ?? [];
            return skus.Select(ObjectMapper.Map<ProductSku, ProductSkuDto>).ToList();
        }

        public async Task<List<ProductSkuDto>> UpsertSkusAsync(Guid productId, UpsertProductSkusDto input)
        {
            var product = await LoadProductWithSkusAsync(productId);

            if (input.ValidateSkuCodeUniqueness)
            {
                var codes = input.Items
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
            }

            foreach (var item in input.Items)
            {
                if (item.Id == Guid.Empty)
                {
                    product.AddSku(
                        GuidGenerator.Create(),
                        item.SkuCode,
                        item.OriginalPrice,
                        item.DiscountRate,
                        item.JdPrice,
                        item.Currency,
                        item.StockQuantity,
                        item.Attributes);
                }
                else
                {
                    product.UpdateSku(
                        item.Id,
                        item.SkuCode,
                        item.OriginalPrice,
                        item.DiscountRate,
                        item.JdPrice,
                        item.Currency,
                        item.StockQuantity,
                        item.Attributes);
                }
            }

            await Repository.UpdateAsync(product, autoSave: true);

            var resultSkus = product.Skus?.OrderBy(s => s.SkuCode).ToList() ?? [];
            return resultSkus.Select(ObjectMapper.Map<ProductSku, ProductSkuDto>).ToList();
        }

        public async Task DeleteSkuAsync(Guid productId, Guid skuId)
        {
            var product = await LoadProductWithSkusAsync(productId);
            product.RemoveSku(skuId);
            await Repository.UpdateAsync(product, autoSave: true);
        }

        private async Task<Product> LoadProductWithSkusAsync(Guid productId)
        {
            var product = await Repository.GetAsync(productId, includeDetails: true);
            if (product == null)
            {
                throw new UserFriendlyException($"Product not found: {productId}");
            }

            if (product.Skus == null)
            {
                // Ensure aggregate has collection initialized when includeDetails doesn't load.
                // Domain methods will initialize when adding.
            }

            return product;
        }
    }
}
