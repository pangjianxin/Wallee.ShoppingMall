using System;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;

namespace Wallee.Mall.Carts;

public interface ICartRepository : IRepository<Cart, Guid>
{
    Task<Cart?> FindByUserIdAsync(Guid userId);
}
