using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;

namespace Wallee.Mall.Captcha
{
    /// <summary>
    /// 验证码生成器接口
    /// </summary>
    public interface ICaptchaGenerator : ITransientDependency
    {
        /// <summary>
        /// 生成验证码
        /// </summary>
        /// <returns>验证码结果</returns>
        Task<CaptchaResult> GenerateAsync();
    }
}
