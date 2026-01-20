using JetBrains.Annotations;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;
using Wallee.Mall.EntityFrameworkCore;
using Wallee.Mall.Tags;

namespace Wallee.Mall.Products
{
    public class EfCoreProductTagRepository(IDbContextProvider<MallDbContext> dbContextProvider)
    : EfCoreRepository<MallDbContext, ProductTag>(dbContextProvider), IProductTagRepository
    {
        public virtual async Task DeleteManyAsync(Guid[] tagIds, CancellationToken cancellationToken = default)
        {
            var dbContext = await GetDbContextAsync();
            var dbSet = dbContext.Set<ProductTag>();
            dbSet.RemoveRange(dbSet.Where(x => tagIds.Contains(x.TagId)));
            await dbContext.SaveChangesAsync(GetCancellationToken(cancellationToken));
        }

        public virtual Task<ProductTag?> FindAsync(
            [NotNull] Guid tagId,
            [NotNull] Guid productId,
            CancellationToken cancellationToken = default)
        {
            return FindAsync(x =>
                    x.TagId == tagId &&
                    x.ProductId == productId,
                cancellationToken: GetCancellationToken(cancellationToken));
        }

        public virtual async Task<List<Guid>> GetProductIdsFilteredByTagAsync(
            [NotNull] Guid tagId,
            CancellationToken cancellationToken = default)
        {
            return await (await GetDbContextAsync()).Set<ProductTag>()
                .Where(q => q.TagId == tagId)
                .Select(q => q.ProductId)
                .ToListAsync(cancellationToken: GetCancellationToken(cancellationToken));
        }

        public virtual async Task<List<Guid>> GetProductIdsFilteredByTagNameAsync(
            [NotNull] string tagName,
            CancellationToken cancellationToken = default)
        {
            var dbContext = await GetDbContextAsync();

            var result = from et in dbContext.Set<ProductTag>()
                         join t in dbContext.Set<Tag>() on et.TagId equals t.Id
                         where t.Name == tagName
                         select et.ProductId;

            return await result.ToListAsync(cancellationToken: GetCancellationToken(cancellationToken));
        }
    }
}
