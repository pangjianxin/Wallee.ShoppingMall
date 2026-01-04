using Wallee.Mall.Localization;
using Volo.Abp.Application.Services;

namespace Wallee.Mall;

/* Inherit your application services from this class.
 */
public abstract class MallAppService : ApplicationService
{
    protected MallAppService()
    {
        LocalizationResource = typeof(MallResource);
    }
}
