using System;
using Volo.Abp.BackgroundJobs;

namespace Wallee.Mall.Medias.BackgroundJobs
{
	[BackgroundJobName("处理媒体缩略图作业")]
	public class MediaThumbnailsJobArgs
	{
		public Guid MediaId { get; set; }

		public string? FileName { get; set; }

		public string? MimeType { get; set; }
	}
}
