using System;

namespace Wallee.Mall.Carousels.Dtos
{
    public class UpdateCarouselDto
    {
        public string Title { get; set; } = default!;

        public string? Description { get; set; }

        public Guid CoverImageMediaId { get; set; }

        public long Priority { get; set; }

        public string Content { get; set; } = default!;
    }
}
