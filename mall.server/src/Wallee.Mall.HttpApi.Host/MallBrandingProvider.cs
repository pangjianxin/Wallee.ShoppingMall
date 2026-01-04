using Microsoft.Extensions.Localization;
using Wallee.Mall.Localization;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Ui.Branding;

namespace Wallee.Mall;

[Dependency(ReplaceServices = true)]
public class MallBrandingProvider : DefaultBrandingProvider
{
    private IStringLocalizer<MallResource> _localizer;

    public MallBrandingProvider(IStringLocalizer<MallResource> localizer)
    {
        _localizer = localizer;
    }

    public override string AppName => _localizer["AppName"];
}
