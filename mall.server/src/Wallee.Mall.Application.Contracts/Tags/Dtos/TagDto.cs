using System;
using Volo.Abp.Application.Dtos;

namespace Wallee.Mall.Tags.Dtos;

[Serializable]
public class TagDto : FullAuditedEntityDto<Guid>
{
    public string Name { get; set; } = string.Empty;

    public string NormalizedName { get; set; } = string.Empty;
}