using System;
using Volo.Abp.Domain.Entities;
using Wallee.Mall.Tags;

namespace Wallee.Mall.Products
{
    public class ProductTag : Entity
    {
        public Guid ProductId { get; private set; }
        public Guid TagId { get; private set; }

        public Product Product { get; private set; } = default!;
        public Tag Tag { get; private set; } = default!;

        private ProductTag()
        {
        }

        public ProductTag(Guid productId, Guid tagId)
        {
            ProductId = productId;
            TagId = tagId;
        }

        public override object[] GetKeys()
        {
            return new object[] { ProductId, TagId };
        }
    }
}
