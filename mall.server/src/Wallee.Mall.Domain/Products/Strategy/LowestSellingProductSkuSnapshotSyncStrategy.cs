using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;

namespace Wallee.Mall.Products.Strategy;

/// <summary>
/// Default (fixed) strategy:
/// - Picks the SKU with the lowest selling price
/// - Uses that SKU's OriginalPrice/Price
/// - JdPrice uses the minimum non-null JdPrice across all SKUs (for display/comparison)
/// </summary>
public class LowestSellingProductSkuSnapshotSyncStrategy : IProductSkuSnapshotSyncStrategy, ITransientDependency
{
    public Task<ProductSkuSnapshot> CalculateAsync(IEnumerable<ProductSku> skus, CancellationToken cancellationToken = default)
    {
        var skuList = skus?.ToList() ?? [];

        if (skuList.Count == 0)
        {
            return Task.FromResult(new ProductSkuSnapshot(null, null, 0m, 0m));
        }

        var chosen = skuList
            .OrderBy(x => x.Price)
            .ThenBy(x => x.OriginalPrice)
            .First();

        return Task.FromResult(new ProductSkuSnapshot(chosen.JdSkuId, chosen.JdPrice, chosen.OriginalPrice, chosen.Price));
    }
}







