using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Localization;
using Wallee.Mall.Localization;

namespace Wallee.Mall.Permissions;

public class MallPermissionDefinitionProvider : PermissionDefinitionProvider
{
    public override void Define(IPermissionDefinitionContext context)
    {
        var myGroup = context.AddGroup(MallPermissions.GroupName);

        var backgroundJobPermission = myGroup.AddPermission(MallPermissions.BackgroundJob.Default, L("Permission:BackgroundJob"));
        backgroundJobPermission.AddChild(MallPermissions.BackgroundJob.Update, L("Permission:Update"));
        backgroundJobPermission.AddChild(MallPermissions.BackgroundJob.Delete, L("Permission:Delete"));

        var auditLogPermissions = myGroup.AddPermission(MallPermissions.AuditLogs.Default, L("Permission:AuditLog"));
        auditLogPermissions.AddChild(MallPermissions.AuditLogs.Delete, L("Permission:Delete"));
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<MallResource>(name);
    }
}
