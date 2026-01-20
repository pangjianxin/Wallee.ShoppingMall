using System;

namespace Wallee.Mall.Cms.Dtos
{
    public class CreateProductPostDto
    {
        public Guid ProductId { get; set; }
        public ProductPostCategory Category { get; set; }
        public string Content { get; set; } = default!;
    }
}
