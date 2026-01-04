using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Wallee.Mall.Medias;

public class MallMedia : AuditedAggregateRoot<Guid>, IMultiTenant
{
	public Guid? TenantId { get; protected set; }
	public string Name { get; protected set; } = null!;

	public string MimeType { get; protected set; } = null!;

	public long Size { get; protected set; }

	protected MallMedia()
	{

	}

	public MallMedia(Guid id, string name, string mimeType, long size, Guid? tenantId = null) : base(id)
	{
		TenantId = tenantId;

		MimeType = Check.NotNullOrWhiteSpace(mimeType, nameof(name), MallMediaConsts.MaxMimeTypeLength);
		Size = size;

		SetName(name);
	}

	public void SetName(string name)
	{
		if (!MediaChecks.IsValidMediaFileName(name))
		{
			throw new UserFriendlyException($"InvalidMediaDescriptorNameException{name}");
		}

		Name = name;
	}
}
