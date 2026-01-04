using OpenAI;
using System;
using System.ClientModel;

namespace Wallee.Mall.DeepSeek
{
    public static class DeepSeekClientFactory
    {
        public static OpenAIClient Create()
        {
            var apiKey = "sk-2279e868728a4f9d9e131a82c5df9b44";
            if (string.IsNullOrWhiteSpace(apiKey))
            {
                throw new InvalidOperationException("DEEPSEEK_API_KEY not set");
            }

            // Base Endpoint (OpenAI 兼容) 假设为 https://api.deepseek.com/v1/
            var options = new OpenAIClientOptions
            {
                Endpoint = new Uri("https://api.deepseek.com")
            };

            // 官方服务通常只支持 API Key；如果支持 OAuth 可替换
            return new OpenAIClient(new ApiKeyCredential(apiKey), options);
        }
    }
}
