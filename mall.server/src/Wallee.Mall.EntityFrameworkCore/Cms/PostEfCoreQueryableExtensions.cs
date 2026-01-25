using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Wallee.Mall.Carousels;

namespace Wallee.Mall.Cms
{
    public static class PostEfCoreQueryableExtensions
    {
        public static IQueryable<Post> IncludeDetails(this IQueryable<Post> queryable, bool include = true)
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
