using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;

namespace Wallee.Mall.Captcha;

/// <summary>
/// 验证码验证接口
/// </summary>
public interface ICaptchaValidator : ITransientDependency
{
    /// <summary>
    /// 验证验证码
    /// </summary>
    /// <param name="captchaId">验证码ID</param>
    /// <param name="userInput">用户输入的验证码</param>
    /// <returns>验证结果</returns>
    Task<bool> ValidateAsync(string captchaId, string userInput);
}
