using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Volo.Abp.BackgroundJobs;
using Volo.Abp.Content;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Guids;
using Volo.Abp.Threading;
using Volo.Abp.Uow;
using Wallee.Mall.Medias;
using Wallee.Mall.Medias.Dtos;

namespace Wallee.Mall.Products.BackgroundJobs
{
    public class DownloadProductCoversJob(
        IGuidGenerator guidGenerator,
        IMallMediaAppService mallMediaAppService,
        ICancellationTokenProvider cancellationTokenProvider,
        IProductRepository productRepository,
        [FromKeyedServices("jd-image")] HttpClient imageDownloadClient)
        : AsyncBackgroundJob<DownloadProductCoversJobArgs>, ITransientDependency
    {
        [UnitOfWork]
        public override async Task ExecuteAsync(DownloadProductCoversJobArgs args)
        {
            if (args.ImageUrls.Count == 0)
            {
                return;
            }

            var product = await productRepository.FindAsync(
                p => p.Id == args.ProductId,
                cancellationToken: cancellationTokenProvider.Token);
            if (product == null)
            {
                return;
            }

            var covers = await DownloadProductCoversAsync(args.ImageUrls);
            product.SetProductCovers([.. covers?.Select(it => it.Id) ?? []]);
            await productRepository.UpdateAsync(product, true, cancellationTokenProvider.Token);
        }

        private async Task<List<MallMediaDto>?> DownloadProductCoversAsync(List<string> imageUrls)
        {
            if (imageUrls.Count == 0)
            {
                return [];
            }

            var resolvedUrls = imageUrls.Select(NormalizeImageUrl).Where(url => url != null).ToArray()!;

            var tasks = resolvedUrls.Select(async url =>
            {
                if (url.IsNullOrEmpty())
                {
                    return null;
                }
                using var response = await imageDownloadClient.GetAsync(url, cancellationTokenProvider.Token);
                response.EnsureSuccessStatusCode();
                var contentType = response.Content.Headers.ContentType?.MediaType ?? "application/octet-stream";
                var stream = await response.Content.ReadAsStreamAsync(cancellationTokenProvider.Token);
                var fileName = ResolveFileName(url, response) ?? $"{guidGenerator.Create():N}";
                var media = await mallMediaAppService.CreateAsync(new CreateMallMediaDto
                {
                    FileName = fileName,
                    File = new RemoteStreamContent(stream, fileName, contentType)
                });

                return media;
            });

            var all = (await Task.WhenAll(tasks)).Where(media => media != null);

            return [.. all.Cast<MallMediaDto>()];
        }

        private static string? NormalizeImageUrl(string? url)
        {
            if (string.IsNullOrWhiteSpace(url))
            {
                return null;
            }

            url = url.Trim();
            if (url.StartsWith("//", StringComparison.Ordinal))
            {
                return $"https:{url}";
            }

            return url;
        }

        private static string? ResolveFileName(string url, HttpResponseMessage response)
        {
            var headerName = response.Content.Headers.ContentDisposition?.FileNameStar
                ?? response.Content.Headers.ContentDisposition?.FileName;

            if (!string.IsNullOrWhiteSpace(headerName))
            {
                return headerName.Trim('"');
            }

            if (Uri.TryCreate(url, UriKind.Absolute, out var uri))
            {
                var fileName = Path.GetFileName(uri.LocalPath);
                if (!string.IsNullOrWhiteSpace(fileName))
                {
                    return fileName;
                }
            }

            return null;
        }
    }
}
