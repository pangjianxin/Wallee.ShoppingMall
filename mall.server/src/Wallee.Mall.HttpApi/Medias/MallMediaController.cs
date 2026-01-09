using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Content;
using Wallee.Mall.Medias.Dtos;

namespace Wallee.Mall.Medias
{
    [Route("api/mall/medias")]
    public class MallMediaController(IMallMediaAppService service) : MallController, IMallMediaAppService
    {
        private readonly IMallMediaAppService _service = service;

        [HttpPost]
        [Route("")]
        public async Task<MallMediaDto> CreateAsync(CreateMallMediaDto input)
        {
            return await _service.CreateAsync(input);
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task DeleteAsync(Guid id)
        {
            await _service.DeleteAsync(id);
        }

        [HttpGet]
        [Route("download/{id}")]
        public async Task<RemoteStreamContent> DownloadAsync(Guid id)
        {
            return await _service.DownloadAsync(id);
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<MallMediaDto> GetAsync(Guid id)
        {
            return await _service.GetAsync(id);
        }

        [HttpGet]
        [Route("")]
        public async Task<PagedResultDto<MallMediaDto>> GetListAsync(MallMediaGetListInput input)
        {
            return await _service.GetListAsync(input);

        }

        [HttpGet]
        [Route("preview/{id}")]
        public async Task<RemoteStreamContent> PreviewAsync(Guid id)
        {
            return await _service.PreviewAsync(id);
        }
    }
}
