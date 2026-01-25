using System;

namespace Wallee.Mall.Cms.Dtos
{
    public class CreatePostDto
    {
        public Guid ProductId { get; set; }
        public PostCategory Category { get; set; }
        public string? Title { get; set; }
        public string Content { get; set; } = default!;
    }
}
