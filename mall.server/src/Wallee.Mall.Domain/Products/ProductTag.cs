using System;
using Volo.Abp.Domain.Entities;

namespace Wallee.Mall.Products
{
    public class ProductTag : Entity
    {
        public Guid ProductId { get; private set; }
        public Guid TagId { get; private set; }
        public string NormalizedTagName { get; private set; } = default!;

        private ProductTag()
        {
        }

        public ProductTag(Guid productId, Guid tagId, string normalizedTagName)
        {
            ProductId = productId;
            TagId = tagId;
            SetNormalizedTagName(normalizedTagName);
        }

        public void SetNormalizedTagName(string normalizedTagName)
        {
            if (string.IsNullOrWhiteSpace(normalizedTagName))
            {
                throw new ArgumentException("Normalized tag name cannot be empty", nameof(normalizedTagName));
            }

            NormalizedTagName = normalizedTagName.Trim().ToLowerInvariant();
        }

        public override object[] GetKeys()
        {
            return [ProductId, TagId];
        }
    }
}
