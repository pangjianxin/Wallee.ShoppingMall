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

        var auditLogPermissions = myGroup.AddPermission(MallPermissions.AuditLog.Default, L("Permission:AuditLog"));
        auditLogPermissions.AddChild(MallPermissions.AuditLog.Delete, L("Permission:Delete"));

        var tagPermission = myGroup.AddPermission(MallPermissions.Tag.Default, L("Permission:Tag"));
        tagPermission.AddChild(MallPermissions.Tag.Create, L("Permission:Create"));
        tagPermission.AddChild(MallPermissions.Tag.Update, L("Permission:Update"));
        tagPermission.AddChild(MallPermissions.Tag.Delete, L("Permission:Delete"));

        var productPermission = myGroup.AddPermission(MallPermissions.Product.Default, L("Permission:Product"));
        productPermission.AddChild(MallPermissions.Product.Create, L("Permission:Create"));
        productPermission.AddChild(MallPermissions.Product.Update, L("Permission:Update"));
        productPermission.AddChild(MallPermissions.Product.Delete, L("Permission:Delete"));

        var cartPermission = myGroup.AddPermission(MallPermissions.Cart.Default, L("Permission:Cart"));
        cartPermission.AddChild(MallPermissions.Cart.Read, L("Permission:Read"));
        cartPermission.AddChild(MallPermissions.Cart.Manage, L("Permission:Manage"));
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<MallResource>(name);
    }
}
