using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;

namespace Wallee.Mall.Data;

/* This is used if database provider does't define
 * IMallDbSchemaMigrator implementation.
 */
public class NullMallDbSchemaMigrator : IMallDbSchemaMigrator, ITransientDependency
{
    public Task MigrateAsync()
    {
        return Task.CompletedTask;
    }
}
