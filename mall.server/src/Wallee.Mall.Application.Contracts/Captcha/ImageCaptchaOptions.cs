namespace Wallee.Mall.Captcha
{
    /// <summary>
    /// 图片验证码配置选项
    /// </summary>
    public class ImageCaptchaOptions
    {
        /// <summary>
        /// 验证码长度
        /// </summary>
        public int CodeLength { get; set; } = 4;

        /// <summary>
        /// 验证码字符集
        /// </summary>
        public string CodeCharacters { get; set; } = "2346789ABCDEFGHJKLMNPRTUVWXYZ";

        /// <summary>
        /// 验证码图片宽度
        /// </summary>
        public int Width { get; set; } = 160;

        /// <summary>
        /// 验证码图片高度
        /// </summary>
        public int Height { get; set; } = 60;

        /// <summary>
        /// 噪点数量
        /// </summary>
        public int NoisePointCount { get; set; } = 100;

        /// <summary>
        /// 噪线数量
        /// </summary>
        public int NoiseLineCount { get; set; } = 4;

        /// <summary>
        /// 验证码过期时间（秒）
        /// </summary>
        public int ExpirationSeconds { get; set; } = 90;

        /// <summary>
        /// 缓存键前缀
        /// </summary>
        public string CacheKeyPrefix { get; set; } = "ImageCaptcha";

        /// <summary>
        /// 是否区分大小写
        /// </summary>
        public bool CaseSensitive { get; set; } = false;
    }
}
