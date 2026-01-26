using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using SixLabors.Fonts;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Drawing.Processing;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Wallee.Mall.Captcha
{
	/// <summary>
	/// 图片验证码生成器
	/// </summary>
	public class ImageCaptchaGenerator : ICaptchaGenerator
	{
		private readonly ICaptchaStore _captchaStore;
		private readonly ImageCaptchaOptions _options;
		private readonly ILogger<ImageCaptchaGenerator> _logger;
		private readonly Random _random;
		private readonly FontCollection _fontCollection;
		private readonly FontFamily _fontFamily;

		public ImageCaptchaGenerator(
			ICaptchaStore captchaStore,
			IOptions<ImageCaptchaOptions> options,
			ILogger<ImageCaptchaGenerator> logger)
		{
			_captchaStore = captchaStore;
			_options = options.Value;
			_logger = logger;
			_random = new Random();

			// 初始化字体
			_fontCollection = new FontCollection();
			_fontFamily = LoadFont();
		}

        /// <summary>
        /// 从内嵌资源加载字体
        /// </summary>
        private FontFamily LoadFont()
        {
            try
            {
                var assembly = System.Reflection.Assembly.GetExecutingAssembly();
                const string fontResourceName = "Wallee.Mall.Fonts.RobotoMono-Light.ttf";
                using var stream = assembly.GetManifestResourceStream(fontResourceName);
                if (stream != null)
                {
                    return _fontCollection.Add(stream);
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "加载字体失败，将使用系统默认字体");

                var systemFonts = SystemFonts.Families.FirstOrDefault();

                if (systemFonts != default)
                {
                    return systemFonts;
                }
            }
            // 保证所有路径都返回值
            return SystemFonts.Families.First();
        }

		/// <summary>
		/// 生成验证码
		/// </summary>
		public async Task<CaptchaResult> GenerateAsync()
		{
			try
			{
				// 生成随机验证码
				string captchaCode = GenerateRandomCode();
				string captchaId = Guid.NewGuid().ToString("N");
				DateTime expiresAt = DateTime.UtcNow.AddSeconds(_options.ExpirationSeconds);

				// 生成验证码图片
				string base64Image = GenerateImage(captchaCode);

				// 存储验证码
				await _captchaStore.StoreAsync(captchaId, captchaCode, expiresAt);

				return new CaptchaResult
				{
					CaptchaId = captchaId,
					CaptchaBase64Image = base64Image,
					ExpiresAt = expiresAt
				};
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "生成验证码时发生错误");
				throw;
			}
		}

		/// <summary>
		/// 生成随机验证码
		/// </summary>
		private string GenerateRandomCode()
		{
			var chars = new char[_options.CodeLength];

			for (int i = 0; i < _options.CodeLength; i++)
			{
				chars[i] = _options.CodeCharacters[_random.Next(0, _options.CodeCharacters.Length)];
			}

			return new string(chars);
		}

		/// <summary>
		/// 生成验证码图片
		/// </summary>
		private string GenerateImage(string code)
		{
			using var image = new Image<Rgba32>(_options.Width, _options.Height);

			// 填充背景色
			image.Mutate(ctx => ctx.Fill(Color.White));

			// 添加干扰线
			for (int i = 0; i < _options.NoiseLineCount; i++)
			{
				var color = GetRandomColor();
				float thickness = _random.Next(1, 3);

				var startPoint = new PointF(
					_random.Next(0, _options.Width),
					_random.Next(0, _options.Height));

				var endPoint = new PointF(
					_random.Next(0, _options.Width),
					_random.Next(0, _options.Height));

				image.Mutate(ctx => ctx.DrawLine(color, thickness, startPoint, endPoint));
			}

			// 添加干扰点
			for (int i = 0; i < _options.NoisePointCount; i++)
			{
				var point = new PointF(
					_random.Next(0, _options.Width),
					_random.Next(0, _options.Height));

				image.Mutate(ctx => ctx.Fill(GetRandomColor(), new RectangleF(point.X, point.Y, 1, 1)));
			}

			// 绘制验证码
			float startX = _options.Width / (code.Length + 1);
			Font font = _fontFamily.CreateFont(30);

			for (int i = 0; i < code.Length; i++)
			{
				float x = startX * (i + 1);
				float y = _random.Next(5, _options.Height - 25);
				float angle = _random.Next(-15, 15);

				image.Mutate(ctx => ctx.DrawText(
					code[i].ToString(),
					font,
					GetRandomColor(),
					new PointF(x, y)));
			}

			// 转换为Base64编码
			using var memoryStream = new MemoryStream();
			image.Save(memoryStream, new PngEncoder());
			var imageBytes = memoryStream.ToArray();
			return $"data:image/png;base64,{Convert.ToBase64String(imageBytes)}";
		}

		/// <summary>
		/// 获取随机颜色
		/// </summary>
		private Color GetRandomColor()
		{
			return Color.FromRgb(
				(byte)_random.Next(0, 160),
				(byte)_random.Next(0, 160),
				(byte)_random.Next(0, 160));
		}
	}
}
