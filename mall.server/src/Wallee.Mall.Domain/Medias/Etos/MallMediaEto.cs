using System;
using Volo.Abp.Domain.Entities.Events.Distributed;
using Volo.Abp.EventBus;

namespace Wallee.Mall.Medias.Etos;

[EventName("Wallee.Mall.Media")]
public class MallMediaEto : EntityEto<Guid>
{
	public string Name { get; set; } = null!;

	public string MimeType { get; set; } = null!;

	public long Size { get; set; }
}
