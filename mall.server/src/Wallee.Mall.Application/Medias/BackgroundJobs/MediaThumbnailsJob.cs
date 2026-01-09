using System;
using System.Threading.Tasks;
using Volo.Abp.BackgroundJobs;
using Volo.Abp.BlobStoring;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Imaging;

namespace Wallee.Mall.Medias.BackgroundJobs
{
    public class MediaThumbnailsJob(
        IBlobContainer<MediaContainer> mediaContainer,
        IBlobContainer<MediaThumbnailContainer> mediaThumbnailContainer,
        IImageResizer imageResizer) : AsyncBackgroundJob<MediaThumbnailsJobArgs>, ITransientDependency
    {

        public override async Task ExecuteAsync(MediaThumbnailsJobArgs args)
        {
            var raw = await mediaContainer.GetAsync(args.MediaId.ToString());

            var thumbnailResult = await imageResizer.ResizeAsync(raw, new ImageResizeArgs { Width = 256, Height = 256, Mode = ImageResizeMode.Crop });

            if (thumbnailResult.State == ImageProcessState.Done)
            {
                await mediaThumbnailContainer.SaveAsync(args.MediaId.ToString(), thumbnailResult.Result);
            }
            else
            {
                throw new Exception(thumbnailResult.State.ToString());
            }
        }
    }
}
