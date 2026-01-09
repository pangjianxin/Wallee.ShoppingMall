using System;
using Volo.Abp.Domain.Repositories;

namespace Wallee.Mall.Tags;

public interface ITagRepository : IRepository<Tag, Guid>
{
}
