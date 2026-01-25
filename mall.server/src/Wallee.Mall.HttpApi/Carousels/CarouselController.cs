using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Wallee.Mall.Carousels.Dtos;

namespace Wallee.Mall.Carousels
{
    [Route("/api/mall/carousels")]
    public class CarouselController(ICarouselAppService service) : MallController, ICarouselAppService
    {
        [HttpPost]
        [Route("")]
        public async Task<CarouselDto> CreateAsync(CreateCarouselDto input)
        {
            return await service.CreateAsync(input);
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task DeleteAsync(Guid id)
        {
            await service.DeleteAsync(id);
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<CarouselDto> GetAsync(Guid id)
        {
            return await service.GetAsync(id);
        }

        [HttpGet]
        [Route("list")]
        public async Task<PagedResultDto<CarouselDto>> GetListAsync(CarouselGetListInput input)
        {
            return await service.GetListAsync(input);
        }

        [HttpGet]
        [Route("list/{productId}")]
        public async Task<List<CarouselDto>> GetListByProductAsync(Guid productId)
        {
            return await service.GetListByProductAsync(productId);
        }

        [HttpPut]
        [Route("{id}")]
        public async Task<CarouselDto> UpdateAsync(Guid id, UpdateCarouselDto input)
        {
            return await service.UpdateAsync(id, input);
        }
    }
}
