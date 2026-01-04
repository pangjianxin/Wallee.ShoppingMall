using System;
using Volo.Abp.Application.Dtos;

namespace Wallee.Mall.Medias.Dtos
{
	public class MallMediaDto : EntityDto<Guid>
	{
		public Guid? TenantId { get; set; }

		public string Name { get; set; } = null!;

		public string MimeType { get; set; } = null!;

		public long Size { get; set; }
	}
}
