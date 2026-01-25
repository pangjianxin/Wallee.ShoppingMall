using System;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;
using Wallee.Mall.EntityFrameworkCore;

namespace Wallee.Mall.Cms
{
    public class EfCorePostRepository(IDbContextProvider<MallDbContext> dbContextProvider) : EfCoreRepository<MallDbContext, Post, Guid>(dbContextProvider), IPostRepository
    {
        public override async Task<IQueryable<Post>> WithDetailsAsync()
        {
            return (await GetQueryableAsync()).IncludeDetails();
        }
    }

}
