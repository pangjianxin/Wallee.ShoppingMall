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
    }
}
