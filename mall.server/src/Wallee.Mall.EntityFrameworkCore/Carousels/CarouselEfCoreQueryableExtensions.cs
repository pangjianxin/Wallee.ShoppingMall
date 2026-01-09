using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Wallee.Mall.Carousels;

public static class CarouselEfCoreQueryableExtensions
{
    public static IQueryable<Carousel> IncludeDetails(this IQueryable<Carousel> queryable, bool include = true)
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
