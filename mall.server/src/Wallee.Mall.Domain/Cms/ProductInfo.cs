using System;
using System.Collections.Generic;
using System.Text;
using Volo.Abp.Domain.Values;
using Wallee.Mall.Products;

namespace Wallee.Mall.Cms
{
    public class ProductInfo : ValueObject
    {
        public Guid ProductId { get; set; }
        public PostCategory Category { get; set; }

        protected override IEnumerable<object> GetAtomicValues()
        {
            yield return ProductId; 
            yield return Category;
        }
    }
}
