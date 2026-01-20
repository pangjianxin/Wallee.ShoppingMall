using System;
using Volo.Abp.Domain.Entities;

namespace Wallee.Mall.Products
{
    public class ProductTag : AggregateRoot
    {
        public Guid ProductId { get; private set; }
        public Guid TagId { get; private set; }

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
            return [ProductId, TagId];
        }
    }
}
