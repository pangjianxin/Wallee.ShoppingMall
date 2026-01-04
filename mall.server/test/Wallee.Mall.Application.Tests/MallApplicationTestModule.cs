using Volo.Abp.Modularity;

namespace Wallee.Mall;

[DependsOn(
    typeof(MallApplicationModule),
    typeof(MallDomainTestModule)
)]
public class MallApplicationTestModule : AbpModule
{

}
