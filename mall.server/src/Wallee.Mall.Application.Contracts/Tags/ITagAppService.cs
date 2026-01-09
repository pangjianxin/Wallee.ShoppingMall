using System;
using Wallee.Mall.Tags.Dtos;
using Volo.Abp.Application.Services;

namespace Wallee.Mall.Tags;


public interface ITagAppService :
    ICrudAppService<
        TagDto,
        Guid,
        TagGetListInput,
        CreateTagDto,
        UpdateTagDto>
{

}