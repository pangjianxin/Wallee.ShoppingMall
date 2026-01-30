using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
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
    IOptions<OneboundOptions> options) : ITransientDependency
{
    private readonly OneboundOptions _options = options.Value;

    private static readonly JsonSerializerOptions _jsonOptions = new(JsonSerializerDefaults.Web)
    {
        PropertyNameCaseInsensitive = true
    };

    // 对应 jd/item_get_pro（按 OneBound 示例：/jd/item_get_pro/?key=...&secret=...&num_iid=...）
    public async Task<JdItemGetProResponse> JdItemGetProTypedAsync(
        string numIid,
        CancellationToken cancellationToken = default)
    {
        var oneBoundClient = httpClientFactory.CreateClient("oneBound");
        if (string.IsNullOrWhiteSpace(numIid))
        {
            throw new ArgumentException("numIid cannot be empty.", nameof(numIid));
        }

        var parameters = new Dictionary<string, string?>(StringComparer.Ordinal)
        {
            ["key"] = _options.AppKey,
            ["secret"] = _options.AppSecret,
            ["num_iid"] = numIid.Trim(),
        };

        var relativeUrl = QueryHelpers.AddQueryString("/jd/item_get_pro", parameters);

        using var resp = await oneBoundClient.GetAsync(relativeUrl, cancellationToken);

        resp.EnsureSuccessStatusCode();

        var stream = await resp.Content.ReadAsStringAsync(cancellationToken);

        var result = jsonSerializer.Deserialize<JdItemGetProResponse>(stream);

        return result ?? new JdItemGetProResponse();
    }
}
