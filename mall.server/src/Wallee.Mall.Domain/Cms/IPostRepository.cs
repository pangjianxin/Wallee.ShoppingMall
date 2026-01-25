using System;
using System.Collections.Generic;
using System.Text;
using Volo.Abp.Domain.Repositories;

namespace Wallee.Mall.Cms
{
    public interface IPostRepository : IRepository<Post, Guid>
    {
    }
}
