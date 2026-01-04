using System;
using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;
using Wallee.Mall.EntityFrameworkCore;

namespace Wallee.Mall.Medias
{
	public class MallMediaRepository : EfCoreRepository<MallDbContext, MallMedia, Guid>, IMallMediaRepository
	{
		public MallMediaRepository(IDbContextProvider<MallDbContext> dbContextProvider) : base(dbContextProvider)
		{
		}
	}
}
