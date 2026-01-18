using System;

namespace Wallee.Mall.Products.Pricing;

/// <summary>
/// A value object-like snapshot of product-level default pricing.
/// </summary>
public sealed class ProductPriceSnapshot
{
    public decimal OriginalPrice { get; init; }
    public decimal DiscountRate { get; init; }
    public decimal? JdPrice { get; init; }
    public string Currency { get; init; } = "CNY";
}
