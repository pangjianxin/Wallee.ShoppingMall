using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace Wallee.Mall.Products
{
    public static class ProductEfCoreQueryableExtensions
    {
        public static IQueryable<Product> IncludeDetails(this IQueryable<Product> queryable, bool include = true)
        {
            if (!include)
            {
                return queryable;
            }

            return queryable
                 .Include(x => x.ProductTags)
                 .Include(x => x.Skus);
        }
    }
}
