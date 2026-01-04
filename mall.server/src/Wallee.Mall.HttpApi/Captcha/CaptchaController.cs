using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Wallee.Mall.Captcha;

[Route("/api/identity/captcha")]
public class CaptchaController : MallController
{
    private readonly ICaptchaGenerator _captchaGenerator;

    public CaptchaController(
        ICaptchaGenerator captchaGenerator)
    {
        _captchaGenerator = captchaGenerator;
    }

    /// <summary>
    /// 生成验证码
    /// </summary>
    [HttpGet]
    [Route("generate")]
    [AllowAnonymous]
    //[EnableRateLimiting("AnonymousUser")]
    public async Task<CaptchaResult> GenerateAsync()
    {
        var captchaResult = await _captchaGenerator.GenerateAsync();

        return new CaptchaResult
        {
            CaptchaId = captchaResult.CaptchaId,
            CaptchaBase64Image = captchaResult.CaptchaBase64Image,
            ExpiresAt = captchaResult.ExpiresAt
        };
    }
}
