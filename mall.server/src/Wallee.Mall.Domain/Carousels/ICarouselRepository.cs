using System;
using Volo.Abp.Domain.Repositories;

namespace Wallee.Mall.Carousels;

public interface ICarouselRepository : IRepository<Carousel, Guid>
{
}
