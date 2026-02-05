using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Json;
using Wallee.Mall.OneBound.Dtos;

namespace Wallee.Mall.OneBound;

public sealed class OneboundClient(
    IHttpClientFactory httpClientFactory,
    IJsonSerializer jsonSerializer,
    IOptions<OneboundOptions> options,
    ILogger<OneboundClient> logger) : ITransientDependency
{
    private readonly OneboundOptions _options = options.Value;

    private static readonly JsonSerializerOptions _jsonOptions = new(JsonSerializerDefaults.Web)
    {
        PropertyNameCaseInsensitive = true
    };

    // 对应 jd/item_get_pro（按 OneBound 示例：/jd/item_get_pro/?key=...&secret=...&num_iid=...）
    public async Task<JdItemGetProResponse?> JdItemGetProTypedAsync(
        string numIid,
        CancellationToken cancellationToken = default)
    {
        var oneBoundClient = httpClientFactory.CreateClient("oneBound");

        var parameters = new Dictionary<string, string?>(StringComparer.Ordinal)
        {
            ["key"] = _options.AppKey,
            ["secret"] = _options.AppSecret,
            ["num_iid"] = numIid.Trim(),
        };

        var relativeUrl = QueryHelpers.AddQueryString("/jd/item_get_pro", parameters);

        using var resp = await oneBoundClient.GetAsync(relativeUrl, cancellationToken);

        resp.EnsureSuccessStatusCode();

        var responseTxt = await resp.Content.ReadAsStringAsync(cancellationToken);

        logger.LogInformation("fetch message from one-bound:{stream}", responseTxt);

        var result = jsonSerializer.Deserialize<JdItemGetProResponse>(responseTxt);

        string[] successCodes = ["0000"];

        if (successCodes .Any(it => it == result.ErrorCode))
        {
            return result;
        }

        return null;
    }
}
