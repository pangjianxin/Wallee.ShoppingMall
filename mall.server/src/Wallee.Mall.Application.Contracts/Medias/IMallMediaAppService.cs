using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Volo.Abp.Content;
using Wallee.Mall.Medias.Dtos;

namespace Wallee.Mall.Medias
{
	public interface IMallMediaAppService : IReadOnlyAppService<MallMediaDto, Guid, MallMediaGetListInput>
	{
		Task<MallMediaDto> CreateAsync(CreateMallMediaDto input);
		Task DeleteAsync(Guid id);
		Task<RemoteStreamContent> DownloadAsync(Guid id);
        Task<RemoteStreamContent> PreviewAsync(Guid id);
    }
}
