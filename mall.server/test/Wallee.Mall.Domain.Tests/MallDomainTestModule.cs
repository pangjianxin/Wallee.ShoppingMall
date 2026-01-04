using Volo.Abp.Modularity;

namespace Wallee.Mall;

[DependsOn(
    typeof(MallDomainModule),
    typeof(MallTestBaseModule)
)]
public class MallDomainTestModule : AbpModule
{

}
