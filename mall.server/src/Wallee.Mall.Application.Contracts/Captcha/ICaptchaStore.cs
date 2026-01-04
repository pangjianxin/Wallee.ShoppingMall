using System;
using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;

namespace Wallee.Mall.Captcha
{
    /// <summary>
    /// 验证码存储接口
    /// </summary>
    public interface ICaptchaStore: ITransientDependency
    {
        /// <summary>
        /// 存储验证码
        /// </summary>
        /// <param name="captchaId">验证码ID</param>
        /// <param name="code">验证码内容</param>
        /// <param name="expiresAt">过期时间</param>
        Task StoreAsync(string captchaId, string code, DateTime expiresAt);

        /// <summary>
        /// 获取验证码
        /// </summary>
        /// <param name="captchaId">验证码ID</param>
        /// <returns>验证码内容，如果不存在或已过期则返回null</returns>
        Task<CaptchaStoreItem> GetAsync(string captchaId);

        /// <summary>
        /// 移除验证码
        /// </summary>
        /// <param name="captchaId">验证码ID</param>
        Task RemoveAsync(string captchaId);
    }
}
