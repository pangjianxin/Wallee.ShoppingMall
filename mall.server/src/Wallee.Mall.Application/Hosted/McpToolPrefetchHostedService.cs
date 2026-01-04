using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;
using Wallee.Mall.Mcp;

namespace Wallee.Mall.Hosted;

public sealed class McpToolPrefetchHostedService : IHostedService
{
    private readonly IMcpToolCache _cache;
    private readonly ILogger<McpToolPrefetchHostedService> _logger;

    public McpToolPrefetchHostedService(IMcpToolCache cache, ILogger<McpToolPrefetchHostedService> logger)
    {
        _cache = cache;
        _logger = logger;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("McpToolPrefetchHostedService starting...");
        await _cache.InitializeAsync(cancellationToken);
        _logger.LogInformation("McpToolPrefetchHostedService completed.");
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("McpToolPrefetchHostedService stopping.");
        return Task.CompletedTask;
    }
}
