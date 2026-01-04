using Wallee.Mall.Localization;
using Volo.Abp.AspNetCore.Mvc;

namespace Wallee.Mall;

/* Inherit your controllers from this class.
 */
public abstract class MallController : AbpControllerBase
{
    protected MallController()
    {
        LocalizationResource = typeof(MallResource);
    }
}
