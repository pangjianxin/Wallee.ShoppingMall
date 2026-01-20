using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Wallee.Mall.Products.Dtos;
using Wallee.Mall.Tags.Dtos;

namespace Wallee.Mall.Tags
{
    [Route("api/mall/tags")]
    [Authorize]
    public class TagController(ITagAppService service) : MallController, ITagAppService
    {
        [HttpPost]
        [Route("")]
        public async Task<TagDto> CreateAsync(CreateTagDto input)
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
        [Route("related/{productId}")]
        public async Task<List<TagDto>> GetAllRelatedTagsAsync(Guid productId)
        {
            return await service.GetAllRelatedTagsAsync(productId);
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<TagDto> GetAsync(Guid id)
        {
            return await service.GetAsync(id);
        }

        [HttpGet]
        [Route("")]
        public async Task<PagedResultDto<TagDto>> GetListAsync(TagGetListInput input)
        {
            return await service.GetListAsync(input);
        }

        [HttpGet]
        [Route("popular/{maxCount}")]
        public async Task<List<PopularTagDto>> GetPopularTagsAsync(int maxCount)
        {
            return await service.GetPopularTagsAsync(maxCount);
        }

        [HttpPut]
        [Route("{id}")]
        public async Task<TagDto> UpdateAsync(Guid id, UpdateTagDto input)
        {
            return await service.UpdateAsync(id, input);
        }
    }
}
