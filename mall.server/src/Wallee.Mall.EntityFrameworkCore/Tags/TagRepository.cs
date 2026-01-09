using System;
using System.Linq;
using System.Threading.Tasks;
using Wallee.Mall.EntityFrameworkCore;
using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;

namespace Wallee.Mall.Tags;

public class TagRepository(IDbContextProvider<MallDbContext> dbContextProvider)
    : EfCoreRepository<MallDbContext, Tag, Guid>(dbContextProvider), ITagRepository
{
    public override async Task<IQueryable<Tag>> WithDetailsAsync()
    {
        return (await GetQueryableAsync()).IncludeDetails();
    }
}