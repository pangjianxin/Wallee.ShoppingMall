using System;
using Volo.Abp.Application.Dtos;

namespace Wallee.Mall.Cms.Dtos
{
    public class ProductPostDto : AuditedEntityDto<Guid>
    {
        public Guid ProductId { get; set; }
        public ProductPostCategory Category { get; set; }
        public string Content { get; set; } = default!;
    }
}
