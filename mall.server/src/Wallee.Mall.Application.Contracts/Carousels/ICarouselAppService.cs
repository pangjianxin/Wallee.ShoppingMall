using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Wallee.Mall.Carousels.Dtos;

namespace Wallee.Mall.Carousels;


public interface ICarouselAppService :
    ICrudAppService<
        CarouselDto,
        Guid,
        CarouselGetListInput,
        CreateCarouselDto,
        UpdateCarouselDto>
{
    Task<List<CarouselDto>> GetListByProductAsync(Guid productId);
}