using AutoFilterer.Extensions;
using System;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Application.Services;
using Wallee.Mall.Localization;
using Wallee.Mall.Tags.Dtos;

namespace Wallee.Mall.Tags;


public class TagAppService : CrudAppService<Tag, TagDto, Guid, TagGetListInput, CreateTagDto, UpdateTagDto>,
    ITagAppService
{
    private readonly ITagRepository _repository;

    public TagAppService(ITagRepository repository) : base(repository)
    {
        _repository = repository;

        LocalizationResource = typeof(MallResource);
        ObjectMapperContext = typeof(MallApplicationModule);
    }

    public override async Task<TagDto> CreateAsync(CreateTagDto input)
    {
        if (_repository.FindAsync(it => it.Name == input.Name) != null)
        {
            throw new UserFriendlyException("已存在标签，不能重复创建");
        }
        var entity = new Tag(GuidGenerator.Create(), input.Name);
        await _repository.InsertAsync(entity);
        return await MapToGetOutputDtoAsync(entity);
    }

    public override async Task<TagDto> UpdateAsync(Guid id, UpdateTagDto input)
    {
        var entity = await _repository.GetAsync(id);
        entity.SetName(input.Name);
        await _repository.UpdateAsync(entity);
        return await MapToGetOutputDtoAsync(entity);
    }

    protected override async Task<IQueryable<Tag>> CreateFilteredQueryAsync(TagGetListInput input)
    {
        // TODO: AbpHelper generated
        return (await base.CreateFilteredQueryAsync(input)).ApplyFilter(input);
    }
}
