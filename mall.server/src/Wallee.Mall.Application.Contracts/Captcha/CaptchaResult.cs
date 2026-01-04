using System;

namespace Wallee.Mall.Captcha
{
    /// <summary>
    /// 验证码结果
    /// </summary>
    public class CaptchaResult
    {
        /// <summary>
        /// 验证码唯一标识
        /// </summary>
        public string CaptchaId { get; set; } = default!;

        /// <summary>
        /// Base64编码的验证码图片
        /// </summary>
        public string CaptchaBase64Image { get; set; } = default!;

        /// <summary>
        /// 验证码过期时间
        /// </summary>
        public DateTime ExpiresAt { get; set; }
    }
}
