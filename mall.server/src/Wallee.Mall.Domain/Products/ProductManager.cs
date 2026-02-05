using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.BackgroundJobs;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;
using Wallee.Mall.Products.BackgroundJobs;

namespace Wallee.Mall.Products
{
    public class ProductManager(
        IProductRepository productRepository,
        IBackgroundJobManager backgroundJobManager) : DomainService
    {
        public async Task<Product> CreateAsync(
            string name,
            int sortOrder,
            string? brand,
            string? shortDescription,
            string? skuId)
        {
            if (await productRepository.AnyAsync(it => it.Name == name))
            {
                throw new UserFriendlyException("该产品已存在");
            }
            var entity = new Product(
                GuidGenerator.Create(),
                name,
                sortOrder,
                brand,
                shortDescription);

            await productRepository.InsertAsync(entity);

            if (skuId != null)
            {
                await backgroundJobManager.EnqueueAsync(new CreateProductByJdSkuJobArgs
                {
                    JdSkuId = skuId
                });
            }
            return entity;
        }
    }
}
