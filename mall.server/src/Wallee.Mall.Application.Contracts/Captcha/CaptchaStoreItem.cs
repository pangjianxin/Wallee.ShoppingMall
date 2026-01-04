using System;
using Volo.Abp.Caching;

namespace Wallee.Mall.Captcha
{
    /// <summary>
    /// 验证码缓存项
    /// </summary>
    [CacheName("Captchas")]
    public class CaptchaStoreItem
    {
        public string Code { get; set; } = default!;
        public DateTime ExpiresAt { get; set; }
    }
}
