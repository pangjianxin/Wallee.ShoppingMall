using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;
using Wallee.Mall.EntityFrameworkCore;

namespace Wallee.Mall.Products;

public class EfCoreProductRepository(IDbContextProvider<MallDbContext> dbContextProvider)
    : EfCoreRepository<MallDbContext, Product, Guid>(dbContextProvider), IProductRepository
{
    public async Task<List<Product>> SearchAsync(
        string? keyword,
        string? attributeKey,
        string? attributeValue,
        CancellationToken cancellationToken = default)
    {
        var predicate = PredicateBuilder.New<Product>(it => it.IsActive == true);

        if (!string.IsNullOrWhiteSpace(keyword))
        {
            var trimmed = keyword.Trim();
            predicate = predicate?.And(p => p.Name.Contains(trimmed) || (p.Brand != null && p.Brand.Contains(trimmed)));
        }

        if (attributeKey.IsNullOrWhiteSpace() == false)
        {
            var key = attributeKey.Trim();
            var value = attributeValue?.Trim();

            if (value.IsNullOrWhiteSpace() == false)
            {
                var signature = ProductSku.NormalizeAttributesSignature([
                    new ProductSkuAttribute(key, value)
                ]);

                predicate = predicate?.And(p => p.Skus != null && p.Skus.Any(s => s.AttributesSignature.Contains(signature)));
            }
            else
            {
                var token = $"{key}:";
                predicate = predicate?.And(p => p.Skus != null && p.Skus.Any(s => s.AttributesSignature.Contains(token)));
            }
        }

        return await GetListAsync(predicate!, includeDetails: true, cancellationToken: cancellationToken);
    }

    public async Task<IQueryable<Product>> GetQueryableWithNoTrackingAsync()
    {
        return (await WithDetailsAsync()).AsNoTracking();
    }

    public override async Task<IQueryable<Product>> WithDetailsAsync()
    {
        return (await GetQueryableAsync()).IncludeDetails();
    }
}
