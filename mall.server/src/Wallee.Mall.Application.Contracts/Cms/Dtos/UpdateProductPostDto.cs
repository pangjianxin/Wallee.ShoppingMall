using System;

namespace Wallee.Mall.Cms.Dtos
{
    public class UpdateProductPostDto
    {
        public ProductPostCategory Category { get; set; }
        public string Content { get; set; } = default!;
    }
}
