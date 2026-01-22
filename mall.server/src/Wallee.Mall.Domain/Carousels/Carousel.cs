using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace Wallee.Mall.Carousels
{
    public class Carousel : AuditedAggregateRoot<Guid>
    {
        public string Title { get; private set; } = default!;
        public string? Description { get; private set; }
        public Guid CoverImageMediaId { get; private set; }
        public long Priority { get; private set; }
        public string Content { get; private set; } = default!;
        public string Link { get; private set; } = default!;

        protected Carousel()
        {
        }

        public Carousel(
            Guid id,
            string title,
            string? description,
            string content,
            Guid coverImageMediaId,
            long priority,
            string link
        ) : base(id)
        {
            Title = title;
            Description = description;
            Content = content;
            CoverImageMediaId = coverImageMediaId;
            Priority = priority;
            Link = link;
        }

        public void Update(
            string title,
            string? description,
            string content,
            Guid coverImageMediaId,
            long priority,
            string link)
        {
            Title = title;
            Description = description;
            Content = content;
            CoverImageMediaId = coverImageMediaId;
            Priority = priority;
            Link = link;
        }
    }
}
