using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace Wallee.Mall.Carts
{
    public static class CartEfCoreQueryableExtensions
    {
        public static IQueryable<Cart> IncludeDetails(this IQueryable<Cart> queryable, bool include = true)
        {
            if (!include)
            {
                return queryable;
            }

            return queryable
                 .Include(x => x.Items); // TODO: AbpHelper generated

        }
    }
}
