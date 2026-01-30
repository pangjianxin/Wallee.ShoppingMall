using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System;
using Volo.Abp.BackgroundJobs;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Guids;
using Volo.Abp.Threading;
using Wallee.Mall.Medias;
using Wallee.Mall.OneBound;
using Wallee.Mall.OneBound.Dtos;
using Microsoft.Extensions.DependencyInjection;
using System.Net.Http;
using System.IO;
using Volo.Abp.Content;
using Wallee.Mall.Medias.Dtos;

namespace Wallee.Mall.Products.BackgroundJobs
{
    public class OneBoundProductFetchingJob(
        OneboundClient oneBoundClient,
        IGuidGenerator guidGenerator,
        IMallMediaAppService mallMediaAppService,
        ICancellationTokenProvider cancellationTokenProvider,
        [FromKeyedServices("jd-image")] HttpClient imageDownloadClient) : AsyncBackgroundJob<OneBoundProductFetchingJobArgs>, ITransientDependency
    {
        public override async Task ExecuteAsync(OneBoundProductFetchingJobArgs args)
        {
            JdItemGetProResponse response = await oneBoundClient.JdItemGetProTypedAsync(args.NumIid, cancellationTokenProvider.Token);

            var item = response.Item;

            if (item == null)
            {
                return;
            }

            var covers = await DownloadProductCoversAsync(item?.ItemImgs?.ItemImg?.Select(img => img.Url!).ToArray() ?? []);

            var product = new Product(guidGenerator.Create(), item?.Title!, 0, item?.Brand!, item?.Desc!);

            product.SetProductCovers([.. covers?.Select(it => it.Id) ?? []]);

            var skus = item?.Skus?.Sku?.Select(it => new ProductSkuInput
            {
                Id = guidGenerator.Create(),
                JdSkuId = it.SkuId!,
                OriginalPrice = decimal.Parse(it.OrginalPrice!),
                JdPrice = decimal.Parse(it.Price!),
                Price = decimal.Parse(it.Price!),
                StockQuantity = 0,
                Attributes = [.. ParseSkuAttributes(it.PropertiesName) ?? []]
            });

            product.UpsertSkus(skus?.ToList() ?? []);

        }

        private static IEnumerable<ProductSkuAttribute>? ParseSkuAttributes(string? propertiesName)
        {
            var attributes = propertiesName?.Split(';', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .Select(part => part.Split(':', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries))
                .Where(parts => parts.Length >= 4)
                .ToDictionary(
                    parts => $"{parts[0]}:{parts[1]}:{parts[2]}",
                    parts => parts.Length == 4 ? parts[3] : string.Join(':', parts.Skip(3)));

            return attributes?.Select(kv => new ProductSkuAttribute(kv.Key, kv.Value));
        }

        private async Task<List<MallMediaDto>?> DownloadProductCoversAsync(string[] imageUrls)
        {
            if (imageUrls.Length == 0)
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

            //过滤掉 null，避免将 null 添加到 List<MallMediaDto>
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
