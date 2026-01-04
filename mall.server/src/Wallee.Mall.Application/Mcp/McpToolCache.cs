using Microsoft.Extensions.AI;
using Microsoft.Extensions.Logging;
using ModelContextProtocol.Client;
using ModelContextProtocol.Protocol;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace Wallee.Mall.Mcp
{
	public sealed class McpToolCache(ILogger<McpToolCache> logger) : IMcpToolCache, IAsyncDisposable
	{
		private readonly ILogger<McpToolCache> _logger = logger;
		private readonly Lock _lock = new();
		private McpClient? _mcpClient;

		// 缓存原始 Tool 定义（用于重连场景）
		private List<Tool> _cachedToolDefinitions = [];
		// 过滤后暴露的工具列表
		private List<AIFunction> _filteredTools = [];

		private bool _initialized;

		private static readonly string _aMAP_URL = "https://mcp.amap.com/mcp?key=27bd1bd9a2db5f2de06b46e3fa287beb";
		private readonly Uri _endpoint = new(_aMAP_URL);
		private readonly string _clientName = "AmapMcpClient";

		// 常量允许列表（名称 -> 描述）
		private static class Allowed
		{
			public static readonly IReadOnlyDictionary<string, string> Tools = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
			{
				["maps_geo"] = "地址地理编码",
				["maps_regeocode"] = "逆地理编码",
				["maps_around_search"] = "周边搜索",
				["maps_search_detail"] = "POI详情",
				["maps_text_search"] = "关键字搜索",
				["maps_weather"] = "天气查询"
			};

			// 需要人工审批的工具名称集合
			public static readonly ISet<string> ApprovalRequired = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
			{
				// "maps_weather"
			};
		}

		public bool Initialized => _initialized;
		public IReadOnlyList<AIFunction> Tools => _filteredTools;

		public async Task InitializeAsync(CancellationToken ct = default)
		{
			if (_initialized) return;

			lock (_lock)
			{
				if (_initialized) return;
			}

			if (_logger.IsEnabled(LogLevel.Information))
			{
				_logger.LogInformation("Initializing MCP tool cache...");
			}

			try
			{
				_mcpClient = await CreateClientAsync(ct);
				var tools = await _mcpClient.ListToolsAsync(cancellationToken: ct);

				lock (_lock)
				{
					// 缓存原始 Tool 定义
					_cachedToolDefinitions = tools.Select(t => t.ProtocolTool).ToList();
					// 应用过滤
					_filteredTools = BuildFilteredTools(tools);
					_initialized = true;
				}

				if (_logger.IsEnabled(LogLevel.Information))
				{
					_logger.LogInformation(
						"MCP tools loaded:  Total={Total} Filtered={Filtered}",
						_cachedToolDefinitions.Count,
						_filteredTools.Count);
				}
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Failed to initialize MCP tool cache");
				throw;
			}
		}

		public ILogger Get_logger()
		{
			return _logger;
		}

		public async Task RefreshAsync(CancellationToken ct = default)
		{
			if (_mcpClient is null)
			{
				_logger.LogWarning("Refresh requested before initialization, initializing now...");
				await InitializeAsync(ct);
				return;
			}

			_logger.LogInformation("Refreshing MCP tool list...");

			try
			{
				var tools = await _mcpClient.ListToolsAsync(cancellationToken: ct);

				lock (_lock)
				{
					_cachedToolDefinitions = [.. tools.Select(t => t.ProtocolTool)];
					_filteredTools = BuildFilteredTools(tools);
				}

				if (_logger.IsEnabled(LogLevel.Information))
					_logger.LogInformation("MCP tools refreshed: Total={Total} Filtered={Filtered}", _cachedToolDefinitions.Count, _filteredTools.Count);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Failed to refresh MCP tool cache");
				throw;
			}
		}

		/// <summary>
		/// 当客户端断开重连时，使用缓存的工具定义构建新的工具列表
		/// 这利用了 SDK PR #938 新增的公共构造函数特性
		/// </summary>
		public async Task ReconnectAsync(CancellationToken ct = default)
		{
			_logger.LogInformation("Reconnecting MCP client with cached tool definitions...");

			// 释放旧客户端
			if (_mcpClient is not null)
			{
				await _mcpClient.DisposeAsync();
				_mcpClient = null;
			}

			// 创建新客户端
			_mcpClient = await CreateClientAsync(ct);

			lock (_lock)
			{
				// 使用缓存的工具定义和新客户端构建 McpClientTool
				// 这避免了再次调用 ListToolsAsync 的网络开销
				_filteredTools = BuildFilteredToolsFromCache(_mcpClient);
			}

			if (_logger.IsEnabled(LogLevel.Information))
				_logger.LogInformation("MCP client reconnected with {Count} cached tools", _filteredTools.Count);
		}

		/// <summary>
		/// 获取缓存的原始工具定义（用于外部序列化/持久化）
		/// </summary>
		public IReadOnlyList<Tool> GetCachedToolDefinitions()
		{
			lock (_lock)
			{
				return [.. _cachedToolDefinitions];
			}
		}

		private async Task<McpClient> CreateClientAsync(CancellationToken ct)
		{
			var httpClient = new HttpClient();
			var transport = new HttpClientTransport(new()
			{
				Endpoint = _endpoint,
				Name = _clientName,
			}, httpClient, loggerFactory: null);

			return await McpClient.CreateAsync(transport, cancellationToken: ct);
		}

		/// <summary>
		/// 从 McpClientTool 列表构建过滤后的工具（初始化/刷新时使用）
		/// </summary>
		private List<AIFunction> BuildFilteredTools(IList<McpClientTool> tools)
		{
			IEnumerable<McpClientTool> source = tools;

			// 如果有白名单，则过滤
			if (Allowed.Tools.Count > 0)
			{
				source = source.Where(t => Allowed.Tools.ContainsKey(t.Name));
			}

			// 应用审批包装
			return [.. source.Select(t => WrapIfApprovalRequired(t))];
		}

		/// <summary>
		/// 从缓存的 Tool 定义构建工具（重连时使用）
		/// 利用 SDK PR #938 的新公共构造函数
		/// </summary>
		private List<AIFunction> BuildFilteredToolsFromCache(McpClient client)
		{
			IEnumerable<Tool> source = _cachedToolDefinitions;

			// 如果有白名单，则过滤
			if (Allowed.Tools.Count > 0)
			{
				source = source.Where(t => Allowed.Tools.ContainsKey(t.Name));
			}

			// 使用新的公共构造函数创建 McpClientTool，并应用审批包装
			return [.. source.Select(toolDef =>
					{
						// 👇 这是 PR #938 新增的公共构造函数
						var clientTool = new McpClientTool(client, toolDef);
						return WrapIfApprovalRequired(clientTool);
					})
				];
		}

		private AIFunction WrapIfApprovalRequired(AIFunction tool)
		{
			if (Allowed.ApprovalRequired.Contains(tool.Name))
			{
				_logger.LogDebug("Tool '{ToolName}' requires approval, wrapping.. .", tool.Name);

				return new ApprovalRequiredAIFunction(tool);
			}
			return tool;
		}

		public async ValueTask DisposeAsync()
		{
			if (_mcpClient is not null)
			{
				await _mcpClient.DisposeAsync();
				_mcpClient = null;
			}

			lock (_lock)
			{
				_cachedToolDefinitions.Clear();
				_filteredTools.Clear();
				_initialized = false;
			}
		}
	}
}
