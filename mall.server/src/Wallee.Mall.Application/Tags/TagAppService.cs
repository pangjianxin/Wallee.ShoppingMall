using AutoFilterer.Extensions;
using System;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Wallee.Mall.Localization;
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

    protected override async Task<IQueryable<Tag>> CreateFilteredQueryAsync(TagGetListInput input)
    {
        // TODO: AbpHelper generated
        return (await base.CreateFilteredQueryAsync(input)).ApplyFilter(input);
    }
}
