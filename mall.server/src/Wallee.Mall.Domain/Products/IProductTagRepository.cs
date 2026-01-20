using JetBrains.Annotations;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;

namespace Wallee.Mall.Products
{
    public interface IProductTagRepository : IRepository<ProductTag>
    {
        Task DeleteManyAsync(Guid[] tagIds, CancellationToken cancellationToken = default);
        Task<ProductTag?> FindAsync([NotNull] Guid tagId, [NotNull] Guid productId, CancellationToken cancellationToken = default);
        Task<List<Guid>> GetProductIdsFilteredByTagAsync([NotNull] Guid tagId, CancellationToken cancellationToken = default);
        Task<List<Guid>> GetProductIdsFilteredByTagNameAsync([NotNull] string tagName, CancellationToken cancellationToken = default);
    }
}
