using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Wallee.Mall.Cms.Dtos;

namespace Wallee.Mall.Cms
{
    [Route("/api/mall/product-posts")]
    public class PostController(IPostAppService service) : MallController, IPostAppService
    {
        [HttpPost]
        [Route("")]
        public async Task<PostDto> CreateAsync(CreatePostDto input)
        {
            return await service.CreateAsync(input);
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<PostDto> GetAsync(Guid id)
        {
            return await service.GetAsync(id);
        }

        [HttpGet]
        [Route("product/{productId}")]
        public async Task<List<PostDto>> GetListByProductAsync(Guid productId)
        {
            return await service.GetListByProductAsync(productId);
        }

        [HttpGet]
        [Route("")]
        public async Task<PagedResultDto<PostDto>> GetListAsync(PostGetListInput input)
        {
            return await service.GetListAsync(input);
        }

        [HttpPut]
        [Route("{id}")]
        public async Task<PostDto> UpdateAsync(Guid id, UpdatePostDto input)
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
