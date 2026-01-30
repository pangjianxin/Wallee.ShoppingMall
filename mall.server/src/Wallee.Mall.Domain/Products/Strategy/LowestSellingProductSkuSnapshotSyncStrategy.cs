using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;

namespace Wallee.Mall.Products.Strategy;

/// <summary>
/// Default (fixed) strategy:
/// - Picks the SKU with the lowest selling price (OriginalPrice * DiscountRate)
/// - Uses that SKU's OriginalPrice/DiscountRate/Currency
/// - JdPrice uses the minimum non-null JdPrice across all SKUs (for display/comparison)
/// 
/// Notes:
/// - Requires that all SKUs use the same currency; otherwise throws a BusinessException.
/// </summary>
public class LowestSellingProductSkuSnapshotSyncStrategy : IProductSkuSnapshotSyncStrategy, ITransientDependency
{
    public Task<ProductSkuSnapshot?> CalculateAsync(Product product, CancellationToken cancellationToken = default)
    {
        var skus = product.Skus?.ToList() ?? [];

        // No SKU: keep current product values.
        if (skus.Count == 0)
        {
            return Task.FromResult(product.SkuSnapshot);
        }

        var chosen = skus
            .OrderBy(x => x.Price)
            .ThenBy(x => x.OriginalPrice)
            .First();

        var minJdPrice = skus
            .Where(x => x.JdPrice.HasValue)
            .Select(x => x.JdPrice!.Value)
            .DefaultIfEmpty()
            .Min();

        return Task.FromResult<ProductSkuSnapshot?>(new ProductSkuSnapshot
        {
            JdSkuId = chosen.JdSkuId,
            OriginalPrice = chosen.OriginalPrice,
            Price = chosen.Price,
            JdPrice = chosen.JdPrice
        });
    }
}
