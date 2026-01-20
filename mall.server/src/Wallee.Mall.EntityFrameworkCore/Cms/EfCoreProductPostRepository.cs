using System;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;
using Wallee.Mall.EntityFrameworkCore;

namespace Wallee.Mall.Cms
{
    public class EfCoreProductPostRepository(IDbContextProvider<MallDbContext> dbContextProvider) : EfCoreRepository<MallDbContext, ProductPost, Guid>(dbContextProvider), IProductPostRepository
    {
        public override async Task<IQueryable<ProductPost>> WithDetailsAsync()
        {
            return (await GetQueryableAsync()).IncludeDetails();
        }
    }

}
