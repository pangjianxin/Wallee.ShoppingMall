using System;
using Volo.Abp.Application.Services;
using Wallee.Mall.Carousels.Dtos;

namespace Wallee.Mall.Carousels;


public interface ICarouselAppService :
    ICrudAppService< 
        CarouselDto, 
        Guid, 
        CarouselGetListInput,
        CreateUpdateCarouselDto,
        CreateUpdateCarouselDto>
{

}