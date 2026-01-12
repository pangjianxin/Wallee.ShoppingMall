using System.Collections.Generic;
using Volo.Abp.Domain.Values;

namespace Wallee.Mall.Products
{
    public class ProductSkuAttribute : ValueObject
    {
        public string Key { get; set; } = default!;
        public string Value { get; set; } = default!;

        private ProductSkuAttribute()
        {
        }

        public ProductSkuAttribute(string key, string value)
        {
            Key = (key ?? string.Empty).Trim();
            Value = value ?? string.Empty;
        }

        protected override IEnumerable<object> GetAtomicValues()
        {
            yield return Key;
            yield return Value;
        }
    }
}
