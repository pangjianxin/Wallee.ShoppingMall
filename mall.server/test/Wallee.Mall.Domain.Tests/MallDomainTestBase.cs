using Volo.Abp.Modularity;

namespace Wallee.Mall;

/* Inherit from this class for your domain layer tests. */
public abstract class MallDomainTestBase<TStartupModule> : MallTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{

}
