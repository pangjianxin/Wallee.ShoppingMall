using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace Wallee.Mall.Tags
{
    public class Tag : FullAuditedAggregateRoot<Guid>
    {
        public string Name { get; private set; } = default!;
        public string NormalizedName { get; private set; } = default!;

        private Tag()
        {
        }

        public Tag(Guid id, string name)
        {
            Id = id;
            SetName(name);
        }

        public void SetName(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                throw new ArgumentException("Tag name cannot be empty", nameof(name));
            }

            Name = name.Trim();
            NormalizedName = Name.ToLowerInvariant();
        }
    }
}
