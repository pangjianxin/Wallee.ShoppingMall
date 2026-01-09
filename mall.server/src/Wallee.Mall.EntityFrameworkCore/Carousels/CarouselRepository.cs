using System;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;
using Wallee.Mall.EntityFrameworkCore;

namespace Wallee.Mall.Carousels;

public class EfCoreCarouselRepository : EfCoreRepository<MallDbContext, Carousel, Guid>, ICarouselRepository
{
    public EfCoreCarouselRepository(IDbContextProvider<MallDbContext> dbContextProvider) : base(dbContextProvider)
    {
    }

    public override async Task<IQueryable<Carousel>> WithDetailsAsync()
    {
        return (await GetQueryableAsync()).IncludeDetails();
    }
}