using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.AuditLogging;
using Volo.Abp.Threading;
using Wallee.Mall.AuditLogs.Dtos;

namespace Wallee.Mall.AuditLogs
{
	public class AuditLogAppService(
		IAuditLogRepository repository,
		ICancellationTokenProvider cancellationTokenProvider) : MallAppService, IAuditLogAppService
	{
		private readonly IAuditLogRepository _repository = repository;
		private readonly ICancellationTokenProvider _cancellationTokenProvider = cancellationTokenProvider;

		public async Task<PagedResultDto<AuditLogDto>> GetListAsync(GetAuditLogsInput input)
		{
			var count = await _repository.GetCountAsync(input.StartTime, input.EndTime, input.HttpMethod,
				input.Url, input.ClientId, input.UserId, input.UserName, input.ApplicationName, input.ClientIpAddress, input.CorrelationId, input.MaxExecutionDuration,
				input.MinExecutionDuration, input.HasException, input.HttpStatusCode, cancellationToken: _cancellationTokenProvider.Token);

			var list = await _repository.GetListAsync(input.Sorting, input.MaxResultCount, input.SkipCount, input.StartTime, input.EndTime, input.HttpMethod,
				input.Url, input.ClientId, input.UserId, input.UserName, input.ApplicationName, input.ClientIpAddress, input.CorrelationId,
				input.MaxExecutionDuration, input.MinExecutionDuration, input.HasException, input.HttpStatusCode, cancellationToken: _cancellationTokenProvider.Token);

			return new PagedResultDto<AuditLogDto>(count, ObjectMapper.Map<List<AuditLog>, List<AuditLogDto>>(list));
		}

		public async Task<AuditLogDto> GetAsync(Guid id)
		{
			var entity = await _repository.GetAsync(id);
			return ObjectMapper.Map<AuditLog, AuditLogDto>(entity);
		}
	}
}
