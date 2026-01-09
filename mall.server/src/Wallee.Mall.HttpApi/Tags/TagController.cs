using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
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


        [HttpPut]
        [Route("{id}")]
        public async Task<TagDto> UpdateAsync(Guid id, UpdateTagDto input)
        {
            return await service.UpdateAsync(id, input);
        }
    }
}
