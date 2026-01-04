using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Threading.Tasks;

namespace Wallee.Mall.Captcha;

    /// <summary>
    /// 图片验证码验证器
    /// </summary>
    public class ImageCaptchaValidator : ICaptchaValidator
    {
        private readonly ICaptchaStore _captchaStore;
        private readonly ImageCaptchaOptions _options;
        private readonly ILogger<ImageCaptchaValidator> _logger;

        public ImageCaptchaValidator(
            ICaptchaStore captchaStore,
            IOptions<ImageCaptchaOptions> options,
            ILogger<ImageCaptchaValidator> logger)
        {
            _captchaStore = captchaStore;
            _options = options.Value;
            _logger = logger;
        }

        /// <summary>
        /// 验证验证码
        /// </summary>
        public async Task<bool> ValidateAsync(string captchaId, string userInput)
        {
            if (string.IsNullOrEmpty(captchaId) || string.IsNullOrEmpty(userInput))
            {
                _logger.LogWarning("验证码ID或用户输入为空");
                return false;
            }

            try
            {
                // 获取存储的验证码
                var storedCode = await _captchaStore.GetAsync(captchaId);

                if (storedCode == null)
                {
                    _logger.LogWarning("验证码不存在或已过期: {CaptchaId}", captchaId);
                    return false;
                }

                // 一次性验证码，验证后立即删除
                await _captchaStore.RemoveAsync(captchaId);

                // 验证用户输入
                bool isValid = _options.CaseSensitive
                    ? storedCode.Code == userInput
                    : storedCode.Code.Equals(userInput, StringComparison.OrdinalIgnoreCase);

                if (!isValid)
                {
                    _logger.LogWarning("验证码不匹配: 期望 {Expected}，实际 {Actual}",
                        storedCode, userInput);
                }

                return isValid;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "验证验证码时发生错误");
                return false;
            }
        }
    }
