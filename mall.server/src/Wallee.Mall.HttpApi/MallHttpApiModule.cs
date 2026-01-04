using Localization.Resources.AbpUi;
using Volo.Abp.Account;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.FeatureManagement;
using Volo.Abp.Identity;
using Volo.Abp.Localization;
using Volo.Abp.Modularity;
using Volo.Abp.PermissionManagement.HttpApi;
using Volo.Abp.SettingManagement;
using Volo.Abp.TenantManagement;
using Wallee.Mall.Localization;
using Wallee.Mall.Medias.Dtos;

namespace Wallee.Mall;

 [DependsOn(
    typeof(MallApplicationContractsModule),
    typeof(AbpPermissionManagementHttpApiModule),
    typeof(AbpSettingManagementHttpApiModule),
    typeof(AbpAccountHttpApiModule),
    typeof(AbpIdentityHttpApiModule),
    typeof(AbpTenantManagementHttpApiModule),
    typeof(AbpFeatureManagementHttpApiModule)
    )]
public class MallHttpApiModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        ConfigureLocalization();

        Configure<AbpAspNetCoreMvcOptions>(options =>
        {           
            options.ConventionalControllers.FormBodyBindingIgnoredTypes.Add(typeof(CreateMallMediaDto));
        });
    }

    private void ConfigureLocalization()
    {
        Configure<AbpLocalizationOptions>(options =>
        {
            options.Resources
                .Get<MallResource>()
                .AddBaseTypes(
                    typeof(AbpUiResource)
                );
        });
    }
}
