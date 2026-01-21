using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Wallee.Mall.Cms.Dtos;

namespace Wallee.Mall.Cms
{
    [Route("/api/mall/product-posts")]
    public class ProductPostController(IProductPostAppService service) : MallController, IProductPostAppService
    {
        [HttpPost]
        [Route("")]
        public async Task<ProductPostDto> CreateAsync(CreateProductPostDto input)
        {
            return await service.CreateAsync(input);
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<ProductPostDto> GetAsync(Guid id)
        {
            return await service.GetAsync(id);
        }

        [HttpGet]
        [Route("product/{productId}")]
        public async Task<List<ProductPostDto>> GetListByProductAsync(Guid productId)
        {
            return await service.GetListByProductAsync(productId);
        }

        [HttpGet]
        [Route("")]
        public async Task<PagedResultDto<ProductPostDto>> GetListAsync(ProductPostGetListInput input)
        {
            return await service.GetListAsync(input);
        }

        [HttpPut]
        [Route("{id}")]
        public async Task<ProductPostDto> UpdateAsync(Guid id, UpdateProductPostDto input)
        {
            return await service.UpdateAsync(id, input);
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task DeleteAsync(Guid id)
        {
            await service.DeleteAsync(id);
        }
    }
}
