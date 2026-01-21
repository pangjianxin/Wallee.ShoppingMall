using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
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
            if (await repository.AnyAsync(it => it.Category == input.Category && it.ProductId == input.ProductId))
            {
                throw new UserFriendlyException("已存在同类型的商品内容");
            }

            var post = new ProductPost(GuidGenerator.Create(), input.ProductId, input.Category, input.Content);

            await repository.InsertAsync(post);

            return await MapToGetOutputDtoAsync(post);
        }

        public async Task DeleteAsync(Guid id)
        {
            await repository.DeleteAsync(id);
        }

        public async Task<ProductPostDto> UpdateAsync(Guid id, UpdateProductPostDto input)
        {
            ProductPost post = await repository.GetAsync(id);
            post.Update(input.Content);
            await repository.UpdateAsync(post);
            return await MapToGetOutputDtoAsync(post);
        }
    }
}
