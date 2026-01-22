using System;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;
using Wallee.Mall.EntityFrameworkCore;

namespace Wallee.Mall.Carts;

public class EfCoreCartRepository : EfCoreRepository<MallDbContext, Cart, Guid>, ICartRepository
{
    public EfCoreCartRepository(IDbContextProvider<MallDbContext> dbContextProvider) : base(dbContextProvider)
    {
    }

    public async Task<Cart?> FindByUserIdAsync(Guid userId)
    {
        return await FindAsync(it => it.CreatorId == userId, includeDetails: true);
    }


    public override async Task<IQueryable<Cart>> WithDetailsAsync()
    {
        return (await GetQueryableAsync()).IncludeDetails();
    }
}
