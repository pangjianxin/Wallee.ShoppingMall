using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;

namespace Wallee.Mall.Cms
{
    public class Post : AuditedAggregateRoot<Guid>
    {
        public string? Title { get; private set; }
        public string Content { get; private set; } = default!;
        public ProductInfo? ProductInfo { get; private set; }

        private Post()
        {
            // for EF Core
        }

        public Post(Guid id, string content, Guid? productId, PostCategory? category, string? title)
            : base(id)
        {
            Title = title;
            Content = Check.NotNullOrWhiteSpace(content, nameof(content));
            SetProductInfo(productId, category);
        }

        public void Update(string content, string? title)
        {
            Title = title;
            Content = Check.NotNullOrWhiteSpace(content, nameof(content));
        }

        public void SetProductInfo(Guid? productId, PostCategory? category)
        {
            if (productId.HasValue && category.HasValue)
            {
                ProductInfo = new ProductInfo { ProductId = productId.Value, Category = category.Value };
                return;
            }

            if (productId.HasValue ^ category.HasValue)
            {
                throw new BusinessException("Mall:PostProductInfoInvalid")
                    .WithData("ProductId", productId)
                    .WithData("Category", category);
            }

            ProductInfo = null;
        }
    }
}
