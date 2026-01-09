
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Wallee.Mall.BackgroundJobs.Dtos;
using Wallee.Mall.Permissions;


namespace Wallee.Mall.BackgroundJobs
{
    [Route("api/mall/background-jobs")]
    [Authorize]
    public class BackgroundJobController(IBackgroundJobAppService service) : MallController, IBackgroundJobAppService
    {
        private readonly IBackgroundJobAppService _service = service;

        [HttpDelete]
        [Route("{id}")]
        [Authorize(MallPermissions.BackgroundJob.Delete)]
        public async Task DeleteAsync(Guid id)
        {
            await _service.DeleteAsync(id);
        }

        [HttpGet]
        [Route("{id}")]
        [Authorize(MallPermissions.BackgroundJob.Default)]
        public async Task<BackgroundJobRecordDto> GetAsync(Guid id)
        {
            return await _service.GetAsync(id);
        }

        [HttpGet]
        [Route("")]
        [Authorize(MallPermissions.BackgroundJob.Default)]
        public async Task<PagedResultDto<BackgroundJobRecordDto>> GetListAsync(BackgroundJobGetListInput input)
        {
            return await _service.GetListAsync(input);
        }

        [HttpGet]
        [Route("waiting/{maxCount}")]
        [Authorize(MallPermissions.BackgroundJob.Default)]
        public async Task<List<BackgroundJobRecordDto>> GetWaitingJobsAsync(int maxCount)
        {
            return await _service.GetWaitingJobsAsync(maxCount);
        }

        [HttpPut]
        [Route("{id}")]
        [Authorize(MallPermissions.BackgroundJob.Update)]
        public async Task<BackgroundJobRecordDto> PendingAsync(Guid id, BackgroundJobPendingDto input)
        {
            return await _service.PendingAsync(id, input);
        }
    }
}
