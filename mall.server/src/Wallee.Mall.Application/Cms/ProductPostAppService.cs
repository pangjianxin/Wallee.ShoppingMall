using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Wallee.Mall.Cms.Dtos;

namespace Wallee.Mall.Cms
{
    public class ProductPostAppService(IProductPostRepository repository)
        : ReadOnlyAppService<ProductPost, ProductPostDto, Guid, ProductPostGetListInput>(repository), IProductPostAppService
    {
        public async Task<List<ProductPostDto>> GetListByProductAsync(Guid productId)
        {
            var list = await repository.GetListAsync(it => it.ProductId == productId);
            return await MapToGetListOutputDtosAsync(list);
        }
        public async Task<ProductPostDto> CreateAsync(CreateProductPostDto input)
        {
            var post = new ProductPost(GuidGenerator.Create(), input.ProductId, input.Category, input.Content);

            await repository.InsertAsync(post);

            return await MapToGetOutputDtoAsync(post);
        }

        public async Task<ProductPostDto> UpdateAsync(Guid id, UpdateProductPostDto input)
        {
            ProductPost post = await repository.GetAsync(id);
            post.Update(input.Category, input.Content);
            await repository.InsertAsync(post);
            return await MapToGetOutputDtoAsync(post);
        }
    }
}
