using AutoFilterer.Extensions;
using System;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Volo.Abp.BlobStoring;
using Volo.Abp.Content;
using Wallee.Mall.Medias.Dtos;

namespace Wallee.Mall.Medias
{
	public class MallMediaAppService(
		IMallMediaRepository repository,
		IBlobContainer<MediaContainer> mediaContainer,
		IMallMediaRepository mediaRepository)
		: ReadOnlyAppService<MallMedia, MallMediaDto, Guid, MallMediaGetListInput>(repository), IMallMediaAppService
	{

		protected IBlobContainer<MediaContainer> MediaContainer { get; } = mediaContainer;

		public virtual async Task<MallMediaDto> CreateAsync(CreateMallMediaDto input)
		{
			var entity = new MallMedia(GuidGenerator.Create(), input.FileName, input.File.ContentType, input.File.ContentLength ?? 0);

			await MediaContainer.SaveAsync(entity.Id.ToString(), input.File.GetStream());
			await repository.InsertAsync(entity);

			return ObjectMapper.Map<MallMedia, MallMediaDto>(entity);
		}

		public virtual async Task<RemoteStreamContent> DownloadAsync(Guid id)
		{
			var entity = await mediaRepository.GetAsync(id);
			var stream = await MediaContainer.GetAsync(id.ToString());

			return new RemoteStreamContent(stream, entity.Name, entity.MimeType);
		}

		public virtual async Task DeleteAsync(Guid id)
		{
			var mediaDescriptor = await repository.GetAsync(id);

			await MediaContainer.DeleteAsync(id.ToString());
			await repository.DeleteAsync(id);
		}

		protected override async Task<IQueryable<MallMedia>> CreateFilteredQueryAsync(MallMediaGetListInput input)
		{
			return (await base.CreateFilteredQueryAsync(input)).ApplyFilter(input);
		}
	}
}
