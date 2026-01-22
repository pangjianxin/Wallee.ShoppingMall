using System;
using Volo.Abp.Application.Dtos;

namespace Wallee.Mall.Carousels.Dtos;

[Serializable]
public class CarouselDto : AuditedEntityDto<Guid>
{
    public string Title { get; set; } = default!;

    public string? Description { get; set; }

    public Guid CoverImageMediaId { get; set; }

    public long Priority { get; set; }

    public Guid? ProductId { get;  set; }
    public string Content { get; set; } = default!;
}