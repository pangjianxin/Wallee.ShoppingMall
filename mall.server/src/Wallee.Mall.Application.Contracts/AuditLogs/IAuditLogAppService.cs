using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Wallee.Mall.AuditLogs.Dtos;

namespace Wallee.Mall.AuditLogs
{
    public interface IAuditLogAppService : IApplicationService
    {
        Task<PagedResultDto<AuditLogDto>> GetListAsync(GetAuditLogsInput input);
        Task<AuditLogDto> GetAsync(Guid id);
    }
}
