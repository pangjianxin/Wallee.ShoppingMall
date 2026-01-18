using System;
using System.Threading;
using System.Threading.Tasks;

namespace Wallee.Mall.Products.Pricing;

/// <summary>
/// Defines how to synchronize Product's default price fields from its SKUs.
/// Keep it extensible so different strategies can be introduced later.
/// </summary>
public interface IProductPriceSyncStrategy
{
    /// <summary>
    /// Calculates the product-level default pricing values from current product state (including SKUs).
    /// </summary>
    Task<ProductPriceSnapshot> CalculateAsync(Product product, CancellationToken cancellationToken = default);
}
