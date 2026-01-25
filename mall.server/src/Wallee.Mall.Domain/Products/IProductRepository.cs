using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;

namespace Wallee.Mall.Products;

public interface IProductRepository : IRepository<Product, Guid>
{
    Task<IQueryable<Product>> GetQueryableWithNoTrackingAsync();
    Task<List<Product>> SearchAsync(
        string? keyword,
        string? attributeKey,
        string? attributeValue,
        CancellationToken cancellationToken = default);
}
