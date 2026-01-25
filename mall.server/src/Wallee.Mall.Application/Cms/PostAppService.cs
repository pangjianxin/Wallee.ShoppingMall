using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Wallee.Mall.Cms.Dtos;

namespace Wallee.Mall.Cms
{
    public class PostAppService(IPostRepository repository)
        : ReadOnlyAppService<Post, PostDto, Guid, PostGetListInput>(repository), IPostAppService
    {
        public async Task<List<PostDto>> GetListByProductAsync(Guid productId)
        {
            var list = await repository.GetListAsync(it => it.ProductInfo != null && it.ProductInfo.ProductId == productId);
            return await MapToGetListOutputDtosAsync(list);
        }
        public async Task<PostDto> CreateAsync(CreatePostDto input)
        {
            if (await repository.AnyAsync(it => it.ProductInfo != null && it.ProductInfo.Category == input.Category && it.ProductInfo.ProductId == input.ProductId))
            {
                throw new UserFriendlyException("已存在同类型的商品内容");
            }

            var post = new Post(GuidGenerator.Create(), input.Content, input.ProductId, input.Category, input.Title);

            await repository.InsertAsync(post);

            return await MapToGetOutputDtoAsync(post);
        }

        public async Task DeleteAsync(Guid id)
        {
            await repository.DeleteAsync(id);
        }

        public async Task<PostDto> UpdateAsync(Guid id, UpdatePostDto input)
        {
            Post post = await repository.GetAsync(id);
            post.Update(input.Content, input.Title);
            await repository.UpdateAsync(post);
            return await MapToGetOutputDtoAsync(post);
        }
    }
}
