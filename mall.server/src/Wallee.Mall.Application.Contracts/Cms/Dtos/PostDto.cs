using System;
using Volo.Abp.Application.Dtos;

namespace Wallee.Mall.Cms.Dtos
{
    public class PostDto : AuditedEntityDto<Guid>
    {
        public ProductInfoDto? ProductInfo { get; set; }
        public string? Title { get; set; }
        public string Content { get; set; } = default!;
    }
}
