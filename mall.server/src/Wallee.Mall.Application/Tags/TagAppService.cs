using AutoFilterer.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Wallee.Mall.Products.Dtos;
using Wallee.Mall.Tags.Dtos;

namespace Wallee.Mall.Tags;


public class TagAppService(ITagRepository repository) : CrudAppService<Tag, TagDto, Guid, TagGetListInput, CreateTagDto, UpdateTagDto>(repository),
    ITagAppService
{
    public override async Task<TagDto> CreateAsync(CreateTagDto input)
    {
        if (await Repository.AnyAsync(it => it.Name == input.Name) == true)
        {
            throw new UserFriendlyException("已存在标签，不能重复创建");
        }
        var entity = new Tag(GuidGenerator.Create(), input.Name);
        await Repository.InsertAsync(entity);
        return await MapToGetOutputDtoAsync(entity);
    }

    public override async Task<TagDto> UpdateAsync(Guid id, UpdateTagDto input)
    {
        var entity = await repository.GetAsync(id);
        if (entity.NormalizedName != input.Name)
        {
            if (await Repository.AnyAsync(it => it.Name == input.Name) == true)
            {
                throw new UserFriendlyException("已存在标签，不能重复创建");
            }
        }
        entity.SetName(input.Name);
        await Repository.UpdateAsync(entity);
        return await MapToGetOutputDtoAsync(entity);
    }

    public virtual async Task<List<TagDto>> GetAllRelatedTagsAsync(Guid productId)
    {
        var entities = await repository.GetAllRelatedTagsAsync(productId);

        return ObjectMapper.Map<List<Tag>, List<TagDto>>(entities);
    }

    public virtual async Task<List<PopularTagDto>> GetPopularTagsAsync(int maxCount)
    {
        return ObjectMapper.Map<List<PopularTag>, List<PopularTagDto>>(
            await repository.GetPopularTagsAsync(maxCount));
    }

    protected override async Task<IQueryable<Tag>> CreateFilteredQueryAsync(TagGetListInput input)
    {
        // TODO: AbpHelper generated
        return (await base.CreateFilteredQueryAsync(input)).ApplyFilter(input);
    }
}
