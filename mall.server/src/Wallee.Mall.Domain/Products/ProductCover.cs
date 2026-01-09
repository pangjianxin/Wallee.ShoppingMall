using System;
using System.Collections.Generic;
using Volo.Abp.Domain.Values;

namespace Wallee.Mall.Products
{
    public class ProductCover : ValueObject
    {
        public Guid MallMediaId { get; set; }

        protected override IEnumerable<object> GetAtomicValues()
        {
            yield return MallMediaId;
        }
    }
}
