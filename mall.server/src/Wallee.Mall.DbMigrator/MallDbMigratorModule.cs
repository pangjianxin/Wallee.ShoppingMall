using Wallee.Mall.EntityFrameworkCore;
using Volo.Abp.Autofac;
using Volo.Abp.Modularity;

namespace Wallee.Mall.DbMigrator;

[DependsOn(
    typeof(AbpAutofacModule),
    typeof(MallEntityFrameworkCoreModule),
    typeof(MallApplicationContractsModule)
)]
public class MallDbMigratorModule : AbpModule
{
}
