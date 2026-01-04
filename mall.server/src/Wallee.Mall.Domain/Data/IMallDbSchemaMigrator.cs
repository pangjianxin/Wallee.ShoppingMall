using System.Threading.Tasks;

namespace Wallee.Mall.Data;

public interface IMallDbSchemaMigrator
{
    Task MigrateAsync();
}
