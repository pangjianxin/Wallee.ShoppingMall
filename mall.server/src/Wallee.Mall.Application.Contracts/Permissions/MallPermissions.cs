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

    public class AuditLogs
    {
        public const string Default = GroupName + ".AuditLog";
        public const string Delete = Default + ".Delete";
    }
}
