using Microsoft.Extensions.AI;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Wallee.Mall.Mcp
{

	public interface IMcpToolCache : IAsyncDisposable
	{
		bool Initialized { get; }
		IReadOnlyList<AIFunction> Tools { get; }
		Task InitializeAsync(CancellationToken ct = default);
		Task RefreshAsync(CancellationToken ct = default);
	}
}
