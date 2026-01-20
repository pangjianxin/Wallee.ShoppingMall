using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Wallee.Mall.Carousels;

namespace Wallee.Mall.Cms
{
    public static class ProductPostEfCoreQueryableExtensions
    {
        public static IQueryable<ProductPost> IncludeDetails(this IQueryable<ProductPost> queryable, bool include = true)
        {
            if (!include)
            {
                return queryable;
            }

            return queryable
                // .Include(x => x.xxx) // TODO: AbpHelper generated
                ;
        }
    }
}
