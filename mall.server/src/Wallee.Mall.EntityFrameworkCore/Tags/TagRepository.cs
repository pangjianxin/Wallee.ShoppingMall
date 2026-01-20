using JetBrains.Annotations;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;
using Wallee.Mall.EntityFrameworkCore;
using Wallee.Mall.Products;

namespace Wallee.Mall.Tags;

public class TagRepository(IDbContextProvider<MallDbContext> dbContextProvider)
    : EfCoreRepository<MallDbContext, Tag, Guid>(dbContextProvider), ITagRepository
{
    public override async Task<IQueryable<Tag>> WithDetailsAsync()
    {
        return (await GetQueryableAsync()).IncludeDetails();
    }

    public virtual async Task<bool> AnyAsync(
        [NotNull] string name,
        CancellationToken cancellationToken = default)
    {
        Check.NotNullOrEmpty(name, nameof(name));

        return await (await GetDbSetAsync()).AnyAsync(x =>
                x.Name == name,
            GetCancellationToken(cancellationToken));
    }

    public virtual Task<Tag> GetAsync(
        [NotNull] string name,
        CancellationToken cancellationToken = default)
    {
        Check.NotNullOrEmpty(name, nameof(name));

        return GetAsync(x =>
                x.Name == name,
            cancellationToken: GetCancellationToken(cancellationToken));
    }

    public virtual Task<Tag?> FindAsync(
        [NotNull] string name,
        CancellationToken cancellationToken = default)
    {
        Check.NotNullOrEmpty(name, nameof(name));

        return FindAsync(x =>
                x.Name == name,
            cancellationToken: GetCancellationToken(cancellationToken));
    }

    public virtual async Task<List<Tag>> GetAllRelatedTagsAsync(
        [NotNull] Guid productId,
        CancellationToken cancellationToken = default)
    {

        var entityTagIds = await (await GetDbContextAsync()).Set<ProductTag>()
            .Where(q => q.ProductId == productId)
            .Select(q => q.TagId)
            .ToListAsync(cancellationToken: GetCancellationToken(cancellationToken));

        var query = (await GetDbSetAsync()).Where(x => entityTagIds.Contains(x.Id));

        return await query.ToListAsync(cancellationToken: GetCancellationToken(cancellationToken));
    }

    public virtual async Task<List<PopularTag>> GetPopularTagsAsync(
        int maxCount,
        CancellationToken cancellationToken = default)
    {
        return await (from tag in await GetDbSetAsync()
                      join productTag in (await GetDbContextAsync()).Set<ProductTag>() on tag.Id equals productTag.TagId
                      group tag by tag.Id into g
                      orderby g.Count() descending
                      select new PopularTag(g.Key, g.First().Name, g.Count()))
            .Take(maxCount)
            .ToListAsync(cancellationToken: GetCancellationToken(cancellationToken));
    }
}