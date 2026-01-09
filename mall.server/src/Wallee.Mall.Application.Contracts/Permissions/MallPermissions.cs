namespace Wallee.Mall.Permissions;

public static class MallPermissions
{
    public const string GroupName = "Mall";

    public class BackgroundJob
    {
        public const string Default = GroupName + ".BackgroundJob";
        public const string Update = Default + ".Update";
        public const string Delete = Default + ".Delete";
    }

    public class AuditLog
    {
        public const string Default = GroupName + ".AuditLog";
        public const string Delete = Default + ".Delete";
    }

    public class Product
    {
        public const string Default = GroupName + ".Product";
        public const string Update = Default + ".Update";
        public const string Create = Default + ".Create";
        public const string Delete = Default + ".Delete";
    }

    public class Tag
    {
        public const string Default = GroupName + ".Tag";
        public const string Update = Default + ".Update";
        public const string Create = Default + ".Create";
        public const string Delete = Default + ".Delete";
    }
}
