using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Wallee.Mall.BackgroundJobs.Dtos;

namespace Wallee.Mall.BackgroundJobs
{
	public interface IBackgroundJobAppService : IReadOnlyAppService<BackgroundJobRecordDto, Guid, BackgroundJobGetListInput>,
		IApplicationService
	{
		Task<List<BackgroundJobRecordDto>> GetWaitingJobsAsync(int maxCount);
		Task<BackgroundJobRecordDto> PendingAsync(Guid id, BackgroundJobPendingDto input);
		Task DeleteAsync(Guid id);
	}
}
