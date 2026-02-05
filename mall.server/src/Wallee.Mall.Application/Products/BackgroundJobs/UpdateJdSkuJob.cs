using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.BackgroundJobs;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Threading;
using Volo.Abp.Uow;
using Wallee.Mall.OneBound;

namespace Wallee.Mall.Products.BackgroundJobs
{
    public class UpdateJdSkuJob(
        OneboundClient oneBoundClient,
        ICancellationTokenProvider cancellationTokenProvider,
        IProductRepository productRepository) : AsyncBackgroundJob<UpdateJdSkuJobArgs>, ITransientDependency
    {
        [UnitOfWork]
        public override async Task ExecuteAsync(UpdateJdSkuJobArgs args)
        {
            var product = await productRepository.GetAsync(it => it.Id == args.ProductId, cancellationToken: cancellationTokenProvider.Token);

            var skus = product.Skus?.Select(it => it.JdSkuId).Where(it => !string.IsNullOrWhiteSpace(it)).ToList();

            if (skus?.Count > 0)
            {
                var skuId = skus.First();

                var res = await oneBoundClient.JdItemGetProTypedAsync(skuId!, cancellationTokenProvider.Token);

                var item = res?.Item;

                var jdPrices = item?.Skus?.Sku?
                 .Where(it => !string.IsNullOrWhiteSpace(it.SkuId))
                 .ToDictionary(
                     it => it.SkuId!.Trim(),
                     it => (decimal?)decimal.Parse(it.Price!),
                     StringComparer.OrdinalIgnoreCase)
                 ?? new Dictionary<string, decimal?>(StringComparer.OrdinalIgnoreCase);

                product?.UpdateJdSkuPrice(jdPrices);
                await productRepository.UpdateAsync(product!, true, cancellationTokenProvider.Token);
            }


        }
    }
}
