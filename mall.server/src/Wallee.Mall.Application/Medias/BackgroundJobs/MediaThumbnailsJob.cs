using System;
using System.IO;
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
            if (!CanGenerateThumbnail(args.FileName, args.MimeType))
            {
                return;
            }

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

        private static bool CanGenerateThumbnail(string? fileName, string? mimeType)
        {
            if (!string.IsNullOrWhiteSpace(mimeType) && mipAwareIsImage(mimeType))
            {
                return true;
            }

            if (string.IsNullOrWhiteSpace(fileName))
            {
                return false;
            }

            var ext = Path.GetExtension(fileName);
            if (string.IsNullOrWhiteSpace(ext))
            {
                return false;
            }

            ext = ext.ToLowerInvariant();
            return ext is ".jpg" or ".jpeg" or ".png" or ".webp" or ".gif" or ".bmp";

            static bool mipAwareIsImage(string mt)
                => mt.StartsWith("image/", StringComparison.OrdinalIgnoreCase);
        }
    }
}
