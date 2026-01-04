using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;
using Wallee.Mall.Products;

namespace Wallee.Mall.EntityFrameworkCore.Products;

public class EfCoreProductRepository : EfCoreRepository<MallDbContext, Product, Guid>, IProductRepository
{
    public EfCoreProductRepository(IDbContextProvider<MallDbContext> dbContextProvider)
        : base(dbContextProvider)
    {
    }

    public async Task<List<Product>> SearchAsync(
        string? keyword,
        string? normalizedTag,
        string? attributeKey,
        string? attributeValue,
        CancellationToken cancellationToken = default)
    {
        var dbSet = await GetDbSetAsync();

        var query = dbSet
            .Include(p => p.Skus)
            .Include(p => p.ProductTags)!.ThenInclude(pt => pt.Tag)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(keyword))
        {
            var like = $"%{keyword.Trim()}%";
            query = query.Where(p => EF.Functions.ILike(p.Name, like) || (p.Brand != null && EF.Functions.ILike(p.Brand, like)));
        }

        if (!string.IsNullOrWhiteSpace(normalizedTag))
        {
            var tag = normalizedTag.Trim().ToLowerInvariant();
            query = query.Where(p => p.ProductTags.Any(pt => pt.Tag.NormalizedName == tag));
        }

        if (!string.IsNullOrWhiteSpace(attributeKey) && !string.IsNullOrWhiteSpace(attributeValue))
        {
            // ÓÃ jsonb contains ¹ýÂË SKU ÊôÐÔ
            query = query.Where(p => p.Skus.Any(sku => EF.Functions.JsonContains(
                sku.Attributes,
                new Dictionary<string, string> { { attributeKey.Trim(), attributeValue.Trim() } })));
        }

        return await query.ToListAsync(cancellationToken);
    }
}
