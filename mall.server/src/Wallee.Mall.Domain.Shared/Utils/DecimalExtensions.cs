using System;

namespace Wallee.Mall.Utils
{
    public static class DecimalExtensions
    {
        public static decimal RoundMoney(this decimal value) => Math.Round(value, 2, MidpointRounding.AwayFromZero);
        public static decimal ValidatePrice(this decimal price)
        {
            if (price < 0)
            {
                throw new ArgumentException("Price cannot be negative", nameof(price));
            }

            return price;
        }

        public static string ToDiscountText(this decimal price, decimal originalPrice)
        {
            if (price >= originalPrice || originalPrice == 0)
            {
                return "NONE";
            }

            var discountRate = price / originalPrice;

            var discount = Math.Round(discountRate * 10m, 2, MidpointRounding.AwayFromZero);
            return $"{discount:0.##}折";
        }
    }
}
