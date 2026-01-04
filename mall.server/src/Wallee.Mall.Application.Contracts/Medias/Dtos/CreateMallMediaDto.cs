using Volo.Abp.Content;

namespace Wallee.Mall.Medias.Dtos
{
	public class CreateMallMediaDto
	{
		public string FileName { get; set; } = string.Empty;
		public IRemoteStreamContent File { get; set; } = default!;
	}
}
