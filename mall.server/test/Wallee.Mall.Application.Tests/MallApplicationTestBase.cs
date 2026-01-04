using Volo.Abp.Modularity;

namespace Wallee.Mall;

public abstract class MallApplicationTestBase<TStartupModule> : MallTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{

}
