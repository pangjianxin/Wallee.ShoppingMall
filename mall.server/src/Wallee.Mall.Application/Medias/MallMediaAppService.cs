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
        IBlobContainer<MediaThumbnailContainer> mediaThumbnailContainer,
        IMallMediaRepository mediaRepository)
        : ReadOnlyAppService<MallMedia, MallMediaDto, Guid, MallMediaGetListInput>(repository), IMallMediaAppService
    {

        public virtual async Task<MallMediaDto> CreateAsync(CreateMallMediaDto input)
        {
            var entity = new MallMedia(GuidGenerator.Create(), input.FileName, input.File.ContentType, input.File.ContentLength ?? 0);

            await mediaContainer.SaveAsync(entity.Id.ToString(), input.File.GetStream());
            await repository.InsertAsync(entity);

            return ObjectMapper.Map<MallMedia, MallMediaDto>(entity);
        }

        public virtual async Task<RemoteStreamContent> DownloadAsync(Guid id)
        {
            var entity = await mediaRepository.GetAsync(id);
            var stream = await mediaContainer.GetAsync(id.ToString());

            return new RemoteStreamContent(stream, entity.Name, entity.MimeType);
        }

        public virtual async Task<RemoteStreamContent> PreviewAsync(Guid id)
        {
            var entity = await mediaRepository.GetAsync(id);
            if (await mediaThumbnailContainer.ExistsAsync(entity.Id.ToString()))
            {
                var thumbnailStream = await mediaThumbnailContainer.GetAsync(id.ToString());

                return new RemoteStreamContent(thumbnailStream, entity.Name, entity.MimeType);
            }

            var stream = await mediaContainer.GetAsync(id.ToString());
            return new RemoteStreamContent(stream, entity.Name, entity.MimeType);
        }

        public virtual async Task DeleteAsync(Guid id)
        {
            var mediaDescriptor = await repository.GetAsync(id);

            await mediaContainer.DeleteAsync(id.ToString());
            await mediaThumbnailContainer.DeleteAsync(id.ToString());
            await repository.DeleteAsync(id);
        }

        protected override async Task<IQueryable<MallMedia>> CreateFilteredQueryAsync(MallMediaGetListInput input)
        {
            return (await base.CreateFilteredQueryAsync(input)).ApplyFilter(input);
        }
    }
}
