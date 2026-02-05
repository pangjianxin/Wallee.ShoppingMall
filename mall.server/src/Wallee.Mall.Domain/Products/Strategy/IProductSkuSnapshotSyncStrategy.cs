using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Wallee.Mall.Products.Strategy;

/// <summary>
/// Defines how to synchronize Product's default price fields from its SKUs.
/// Keep it extensible so different strategies can be introduced later.
/// </summary>
public interface IProductSkuSnapshotSyncStrategy
{
    /// <summary>
    /// Calculates the product-level default pricing values from current SKUs.
    /// </summary>
    Task<ProductSkuSnapshot> CalculateAsync(IEnumerable<ProductSku> skus, CancellationToken cancellationToken = default);
}
