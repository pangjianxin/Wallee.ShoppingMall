using JetBrains.Annotations;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;

namespace Wallee.Mall.Tags;

public interface ITagRepository : IRepository<Tag, Guid>
{
    Task<bool> AnyAsync([NotNull] string name, CancellationToken cancellationToken = default);
    Task<Tag?> FindAsync([NotNull] string name, CancellationToken cancellationToken = default);
    Task<List<Tag>> GetAllRelatedTagsAsync([NotNull] Guid productId, CancellationToken cancellationToken = default);
    Task<Tag> GetAsync([NotNull] string name, CancellationToken cancellationToken = default);
    Task<List<PopularTag>> GetPopularTagsAsync(int maxCount, CancellationToken cancellationToken = default);
}
