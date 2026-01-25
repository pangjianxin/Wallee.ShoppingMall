using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Wallee.Mall.Cms.Dtos;

namespace Wallee.Mall.Cms
{
    public interface IPostAppService : IReadOnlyAppService<PostDto, Guid, PostGetListInput>
    {
        Task<PostDto> CreateAsync(CreatePostDto input);
        Task DeleteAsync(Guid id);
        Task<List<PostDto>> GetListByProductAsync(Guid productId);
        Task<PostDto> UpdateAsync(Guid id, UpdatePostDto input);
    }
}
