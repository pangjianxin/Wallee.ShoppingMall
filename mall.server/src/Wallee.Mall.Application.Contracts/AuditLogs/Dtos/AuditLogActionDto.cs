using System;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Data;

namespace Wallee.Mall.AuditLogs.Dtos
{
    public class AuditLogActionDto : EntityDto<Guid>, IHasExtraProperties
    {
        public Guid? TenantId { get; set; }

        public Guid AuditLogId { get; set; }

        public string? ServiceName { get; set; }

        public string? MethodName { get; set; }

        public string? Parameters { get; set; }

        public DateTime ExecutionTime { get; set; }

        public int ExecutionDuration { get; set; }

        public ExtraPropertyDictionary ExtraProperties { get; set; } = default!;
    }
}
