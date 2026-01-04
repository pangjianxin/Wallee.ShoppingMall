using AutoFilterer.Extensions;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Volo.Abp.BackgroundJobs;
using Wallee.Mall.BackgroundJobs.Dtos;

namespace Wallee.Mall.BackgroundJobs;

public class BackgroundJobAppService : ReadOnlyAppService<BackgroundJobRecord, BackgroundJobRecordDto, Guid, BackgroundJobGetListInput>, IBackgroundJobAppService
{
	public IBackgroundJobRepository BackgroundJobRepository { get; }
	private string _applicationName;
	public BackgroundJobAppService(
		IBackgroundJobRepository repository,
		IOptions<AbpBackgroundJobWorkerOptions> options) : base((Volo.Abp.Domain.Repositories.IReadOnlyRepository<BackgroundJobRecord, Guid>)repository)
	{
		BackgroundJobRepository = repository;
		_applicationName = options.Value.ApplicationName!;
	}


	public async Task<List<BackgroundJobRecordDto>> GetWaitingJobsAsync(int maxCount)
	{
		var list = await BackgroundJobRepository.GetWaitingListAsync(_applicationName, maxCount);

		return ObjectMapper.Map<List<BackgroundJobRecord>, List<BackgroundJobRecordDto>>(list);
	}

	public async Task<BackgroundJobRecordDto> PendingAsync(Guid id, BackgroundJobPendingDto input)
	{
		var bj = await BackgroundJobRepository.GetAsync(id);

		bj.NextTryTime = input.NextTryTime;

		await BackgroundJobRepository.UpdateAsync(bj);

		return ObjectMapper.Map<BackgroundJobRecord, BackgroundJobRecordDto>(bj);
	}

	public async Task DeleteAsync(Guid id)
	{
		await BackgroundJobRepository.DeleteAsync(id);
	}

	protected override async Task<IQueryable<BackgroundJobRecord>> CreateFilteredQueryAsync(BackgroundJobGetListInput input)
	{
		return (await base.CreateFilteredQueryAsync(input)).ApplyFilter(input);
	}

}
