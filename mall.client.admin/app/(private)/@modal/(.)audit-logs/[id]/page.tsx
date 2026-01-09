import AuditLogDetail from "@/components/audit-logs/detail";
import { auditLogGet } from "@/openapi";
import { client } from "@/hey-api/client";
const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const { data: auditLog } = await auditLogGet({
    client,
    throwOnError: true,
    path: { id },
  });
  return <AuditLogDetail auditLog={auditLog!} />;
};

Page.displayName = "AuditLogPage";

export default Page;
