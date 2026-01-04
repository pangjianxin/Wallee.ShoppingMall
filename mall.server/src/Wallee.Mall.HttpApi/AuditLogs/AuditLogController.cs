using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Wallee.Mall.AuditLogs.Dtos;

namespace Wallee.Mall.AuditLogs
{
    [Route("api/admin/audit-log")]
    [Authorize]
    public class AuditLogController : MallController, IAuditLogAppService
    {
        private readonly IAuditLogAppService _service;

        public AuditLogController(IAuditLogAppService service)
        {
            _service = service;
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<AuditLogDto> GetAsync(Guid id)
        {
            return await _service.GetAsync(id);
        }

        [HttpGet]
        [Route("")]
        public async Task<PagedResultDto<AuditLogDto>> GetListAsync(GetAuditLogsInput input)
        {
            return await _service.GetListAsync(input);
        }
    }
}
