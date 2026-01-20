using System;
using Wallee.Mall.Tags.Dtos;
using Volo.Abp.Application.Services;
using System.Threading.Tasks;
using System.Collections.Generic;
using Wallee.Mall.Products.Dtos;

namespace Wallee.Mall.Tags;


public interface ITagAppService :
    ICrudAppService<
        TagDto,
        Guid,
        TagGetListInput,
        CreateTagDto,
        UpdateTagDto>
{
    Task<List<TagDto>> GetAllRelatedTagsAsync(Guid productId);
    Task<List<PopularTagDto>> GetPopularTagsAsync(int maxCount);
}