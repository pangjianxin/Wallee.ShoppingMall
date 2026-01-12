using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Wallee.Mall.Products.Dtos;

namespace Wallee.Mall.Products
{
    [Route("/api/mall/products")]
    public class ProductController(IProductAppService service) : MallController, IProductAppService
    {
        [HttpPost]
        [Route("")]
        public async Task<ProductDto> CreateAsync(CreateProductDto input)
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
        public async Task<ProductDto> GetAsync(Guid id)
        {
            return await service.GetAsync(id);
        }

        [HttpGet]
        [Route("")]
        public async Task<PagedResultDto<ProductDto>> GetListAsync(ProductGetListInput input)
        {
            return await service.GetListAsync(input);
        }

        [HttpPut]
        [Route("{id}")]
        public async Task<ProductDto> UpdateAsync(Guid id, UpdateProductDto input)
        {
            return await service.UpdateAsync(id, input);
        }

        [HttpGet]
        [Route("{id}/skus")]
        public async Task<List<ProductSkuDto>> GetSkusAsync(Guid id)
        {
            return await service.GetSkusAsync(id);
        }

        [HttpPut]
        [Route("{id}/skus")]
        public async Task<ProductDto> UpsertSkusAsync(Guid id, UpsertProductSkusDto input)
        {
            return await service.UpsertSkusAsync(id, input);
        }
    }
}
