using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace Wallee.Mall.Cms
{
    public class ProductPost(Guid id, Guid productId, ProductPostCategory category, string content) : AuditedAggregateRoot<Guid>(id)
    {
        public Guid ProductId { get; private set; } = productId;
        public ProductPostCategory Category { get; private set; } = category;
        public string Content { get; private set; } = content;

        public void Update(ProductPostCategory category, string content)
        {
            Category = category;
            Content = content;
        }
    }
}
