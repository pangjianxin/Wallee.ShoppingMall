using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Options;
using System;
using System.Threading.Tasks;
using Volo.Abp.Caching;

namespace Wallee.Mall.Captcha
{
    /// <summary>
    /// 分布式缓存实现的验证码存储
    /// </summary>
    public class DistributedCacheCaptchaStore : ICaptchaStore
    {
        private readonly IDistributedCache<CaptchaStoreItem> _cache;
        private readonly ImageCaptchaOptions _options;

        public DistributedCacheCaptchaStore(
            IDistributedCache<CaptchaStoreItem> cache,
            IOptions<ImageCaptchaOptions> options)
        {
            _cache = cache;
            _options = options.Value;
        }

        public async Task StoreAsync(string captchaId, string code, DateTime expiresAt)
        {
            var cacheOptions = new DistributedCacheEntryOptions
            {
                AbsoluteExpiration = expiresAt
            };

            var cacheItem = new CaptchaStoreItem
            {
                Code = code,
                ExpiresAt = expiresAt
            };

            await _cache.SetAsync(GetCacheKey(captchaId), cacheItem, cacheOptions);
        }

        public async Task<CaptchaStoreItem> GetAsync(string captchaId)
        {
            var cacheValue = await _cache.GetAsync(GetCacheKey(captchaId));

            return cacheValue!;
        }

        public async Task RemoveAsync(string captchaId)
        {
            await _cache.RemoveAsync(GetCacheKey(captchaId));
        }

        private string GetCacheKey(string captchaId)
        {
            return $"{_options.CacheKeyPrefix}:{captchaId}";
        }
    }
}
