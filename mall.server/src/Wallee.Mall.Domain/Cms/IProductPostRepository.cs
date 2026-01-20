using System;
using System.Collections.Generic;
using System.Text;
using Volo.Abp.Domain.Repositories;

namespace Wallee.Mall.Cms
{
    public interface IProductPostRepository : IRepository<ProductPost, Guid>
    {
    }
}
