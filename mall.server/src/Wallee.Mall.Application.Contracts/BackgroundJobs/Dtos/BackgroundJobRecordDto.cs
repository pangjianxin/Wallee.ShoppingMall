using System;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Auditing;
using Volo.Abp.BackgroundJobs;

namespace Wallee.Mall.BackgroundJobs.Dtos
{
	public class BackgroundJobRecordDto : EntityDto<Guid>, IHasCreationTime
	{
		/// <summary>
		/// Application name that scheduled this job.
		/// </summary>
		public string? ApplicationName { get; set; } = default!;
		//
		// 摘要:
		//     Name of the job.
		public string? JobName { get; set; } = default!;
		//
		// 摘要:
		//     Job arguments as serialized to string.
		public string? JobArgs { get; set; } = default!;
		//
		// 摘要:
		//     Try count of this job. A job is re-tried if it fails.
		public short TryCount { get; set; }

		//
		// 摘要:
		//     Next try time of this job.
		public DateTime NextTryTime { get; set; }
		//
		// 摘要:
		//     Last try time of this job.
		public DateTime? LastTryTime { get; set; }
		//
		// 摘要:
		//     This is true if this job is continuously failed and will not be executed again.
		public bool IsAbandoned { get; set; }
		//
		// 摘要:
		//     Priority of this job.
		public BackgroundJobPriority Priority { get; set; }
		/// <summary>
		/// 生成日期
		/// </summary>
		public DateTime CreationTime { get; set; }
	}
}
