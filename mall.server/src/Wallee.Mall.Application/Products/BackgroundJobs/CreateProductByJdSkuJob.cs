using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.BackgroundJobs;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Guids;
using Volo.Abp.Threading;
using Volo.Abp.Uow;
using Wallee.Mall.OneBound;
using Wallee.Mall.OneBound.Dtos;
using Wallee.Mall.Products.Strategy;

namespace Wallee.Mall.Products.BackgroundJobs
{
    public class CreateProductByJdSkuJob(
        OneboundClient oneBoundClient,
        IGuidGenerator guidGenerator,
        ICancellationTokenProvider cancellationTokenProvider,
        IProductRepository productRepository,
        IBackgroundJobManager backgroundJobManager,
        IProductSkuSnapshotSyncStrategy productSkuSnapshotSyncStrategy) : AsyncBackgroundJob<CreateProductByJdSkuJobArgs>, ITransientDependency
    {
        [UnitOfWork]
        public override async Task ExecuteAsync(CreateProductByJdSkuJobArgs args)
        {
            JdItemGetProResponse? response = await oneBoundClient.JdItemGetProTypedAsync(args.JdSkuId, cancellationTokenProvider.Token);

            var item = response?.Item;
            if (item == null)
            {
                return;
            }

            var imageUrls = item?.ItemImgs?.ItemImg?.Select(img => img.Url!).ToArray() ?? [];
            var product = new Product(guidGenerator.Create(), item?.Title!, 0, item?.Brand!, item?.Desc!);
            var skus = item?.Skus?.Sku?.Select(it => new ProductUpdateSkuInput
            {
                Id = guidGenerator.Create(),
                JdSkuId = it.SkuId!,
                OriginalPrice = decimal.Parse(it.OrginalPrice!),
                JdPrice = decimal.Parse(it.Price!),
                Price = decimal.Parse(it.Price!),
                StockQuantity = 0,
                Attributes = [.. ParseSkuAttributes(it.PropertiesName) ?? []]
            });

            product.UpdateSkus(skus?.ToList() ?? []);

            var snapshot = product.Skus != null && product.Skus.Count > 0
                ? await productSkuSnapshotSyncStrategy.CalculateAsync(product.Skus)
                : new ProductSkuSnapshot(product.DefaultJdSkuId, product.DefaultJdPrice, product.DefaultOriginalPrice, product.DefaultPrice);

            product.SetSkuSnapshot(snapshot);

            await productRepository.InsertAsync(product, true, cancellationTokenProvider.Token);

            if (imageUrls.Length > 0)
            {
                await backgroundJobManager.EnqueueAsync(new DownloadProductCoversJobArgs
                {
                    ProductId = product.Id,
                    ImageUrls = [.. imageUrls]
                });
            }
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
    }
}
