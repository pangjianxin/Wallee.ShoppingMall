using Volo.Abp.Settings;

namespace Wallee.Mall.Settings;

public class MallSettingDefinitionProvider : SettingDefinitionProvider
{
    public override void Define(ISettingDefinitionContext context)
    {
        //Define your own settings here. Example:
        //context.Add(new SettingDefinition(MallSettings.MySetting1));
    }
}
