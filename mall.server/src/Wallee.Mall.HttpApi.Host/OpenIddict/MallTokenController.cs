using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using OpenIddict.Abstractions;
using OpenIddict.Server.AspNetCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.AspNetCore.Controllers;
using Volo.Abp.OpenIddict.Controllers;
using Wallee.Mall.Captcha;

namespace Wallee.Mall.OpenIddict
{
	[Route("/connect/token")]
	[IgnoreAntiforgeryToken]
	[ApiExplorerSettings(IgnoreApi = true)]
	[ReplaceControllers(typeof(TokenController))]
	public class MallTokenController : TokenController
	{

		public override async Task<IActionResult> HandleAsync()
		{
			var request = await GetOpenIddictServerRequestAsync(HttpContext);

			if (request.IsPasswordGrantType())
			{
				Console.WriteLine("Password grant type detected.");
			}


			return await base.HandleAsync();
		}

		// 重写 password 流的处理点（推荐在这里做验证码、风控等校验）
		protected override async Task<IActionResult> HandlePasswordAsync(OpenIddictRequest request)
		{
			var captcha = request.GetParameter("captchacode")?.ToString();
			var captchaId = request.GetParameter("captchaid")?.ToString();

			if (string.IsNullOrEmpty(captcha) || string.IsNullOrEmpty(captchaId))
			{
				// 将 Dictionary<string, string> 替换为 Dictionary<string, string?>，以匹配 AuthenticationProperties 的构造函数参数类型
				return Forbid(new AuthenticationProperties(new Dictionary<string, string?>
				{
					[OpenIddictServerAspNetCoreConstants.Properties.Error] = OpenIddictConstants.Errors.InvalidGrant,
					[OpenIddictServerAspNetCoreConstants.Properties.ErrorDescription] = "图形验证码不能为空"
				}), OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);
			}

			if (!await ValidateCaptchaAsync(captchaId, captcha))
			{
				// 同理，下面也做相同的替换
				return Forbid(new AuthenticationProperties(new Dictionary<string, string?>
				{
					[OpenIddictServerAspNetCoreConstants.Properties.Error] = OpenIddictConstants.Errors.InvalidGrant,
					[OpenIddictServerAspNetCoreConstants.Properties.ErrorDescription] = "图形验证码错误"
				}), OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);
			}

			// 验证码通过后，继续走基类的密码登录逻辑（校验用户/锁定/2FA/周期改密等）
			return await base.HandlePasswordAsync(request);
		}

		private async Task<bool> ValidateCaptchaAsync(string captchaId, string captcha)
		{
			ICaptchaValidator captchaValidator = LazyServiceProvider.GetRequiredService<ICaptchaValidator>();

			var validationResult = await captchaValidator.ValidateAsync(captchaId, captcha);

			// 替换为你自己的验证码校验逻辑（如 Redis/DB 校验）
			return validationResult;
		}
	}
}
