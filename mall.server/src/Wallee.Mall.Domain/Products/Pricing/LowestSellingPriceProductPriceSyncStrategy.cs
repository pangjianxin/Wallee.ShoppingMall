using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.DependencyInjection;

namespace Wallee.Mall.Products.Pricing;

/// <summary>
/// Default (fixed) strategy:
/// - Picks the SKU with the lowest selling price (OriginalPrice * DiscountRate)
/// - Uses that SKU's OriginalPrice/DiscountRate/Currency
/// - JdPrice uses the minimum non-null JdPrice across all SKUs (for display/comparison)
/// 
/// Notes:
/// - Requires that all SKUs use the same currency; otherwise throws a BusinessException.
/// </summary>
public class LowestSellingPriceProductPriceSyncStrategy : IProductPriceSyncStrategy, ITransientDependency
{
    public Task<ProductPriceSnapshot> CalculateAsync(Product product, CancellationToken cancellationToken = default)
    {
        var skus = product.Skus?.ToList() ?? [];

        // No SKU: keep current product values.
        if (skus.Count == 0)
        {
            return Task.FromResult(new ProductPriceSnapshot
            {
                OriginalPrice = product.OriginalPrice,
                DiscountRate = product.DiscountRate,
                JdPrice = product.JdPrice,
                Currency = product.Currency
            });
        }

        // Currency consistency check
        var currencies = skus
            .Select(x => string.IsNullOrWhiteSpace(x.Currency) ? "CNY" : x.Currency.Trim().ToUpperInvariant())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        if (currencies.Count > 1)
        {
            throw new BusinessException("Mall:SkuCurrencyNotConsistent")
                .WithData("Currencies", string.Join(",", currencies));
        }

        var chosen = skus
            .OrderBy(x => x.GetSellingPrice())
            .ThenBy(x => x.SkuCode, StringComparer.OrdinalIgnoreCase)
            .First();

        var minJdPrice = skus
            .Where(x => x.JdPrice.HasValue)
            .Select(x => x.JdPrice!.Value)
            .DefaultIfEmpty()
            .Min();

        return Task.FromResult(new ProductPriceSnapshot
        {
            OriginalPrice = chosen.OriginalPrice,
            DiscountRate = chosen.DiscountRate,
            JdPrice = skus.Any(x => x.JdPrice.HasValue) ? minJdPrice : null,
            Currency = chosen.Currency
        });
    }
}
