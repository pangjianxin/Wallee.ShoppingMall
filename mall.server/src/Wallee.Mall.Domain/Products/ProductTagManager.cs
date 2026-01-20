using JetBrains.Annotations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Services;
using Wallee.Mall.Tags;

namespace Wallee.Mall.Products
{
    public class ProductTagManager(
        IProductTagRepository productTagRepository,
        ITagRepository tagRepository,
        TagManager tagManager) : DomainService
    {
        public virtual async Task<ProductTag> AddTagToProductAsync(
        [NotNull] Guid tagId,
        [NotNull] Guid productId,
        CancellationToken cancellationToken = default)
        {
            var entityTag = new ProductTag(productId, tagId);
            return await productTagRepository.InsertAsync(entityTag, cancellationToken: cancellationToken);
        }

        public virtual async Task RemoveTagFromProductAsync(
            [NotNull] Guid tagId,
            [NotNull] Guid productId,
            CancellationToken cancellationToken = default)
        {
            var entityTag = await productTagRepository.FindAsync(tagId, productId, cancellationToken);
            if (entityTag != null)
                await productTagRepository.DeleteAsync(entityTag, cancellationToken: cancellationToken);
        }

        public async Task SetProductTagsAsync(Guid productId, List<string> tags)
        {
            var existingTags =
              await tagRepository.GetAllRelatedTagsAsync(productId);

            var deletedTags = existingTags.Where(x => !tags.Contains(x.Name)).ToList();
            var addedTags = tags.Where(x => !existingTags.Any(a => a.Name == x));

            await productTagRepository.DeleteManyAsync([.. deletedTags.Select(s => s.Id)]);

            foreach (var addedTag in addedTags)
            {
                var tag = await tagManager.GetOrAddAsync(addedTag);

                await AddTagToProductAsync(tag.Id, productId);
            }
        }

        public async Task<List<Guid>> GetProductIdsFilteredByTagAsync(
            [NotNull] Guid tagId,
            CancellationToken cancellationToken = default)
        {
            return await productTagRepository.GetProductIdsFilteredByTagAsync(tagId, cancellationToken);
        }
        public async Task<List<Guid>> GetProductIdsFilteredByTagNameAsync(
            [NotNull] string tagName,
            CancellationToken cancellationToken = default)
        {
            return await productTagRepository.GetProductIdsFilteredByTagNameAsync(tagName, cancellationToken);
        }
    }
}
