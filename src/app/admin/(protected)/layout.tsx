import { AdminAuthProvider } from "@/components/admin/auth-provider";
import { AdminShell } from "@/components/admin/admin-shell";

export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminShell>{children}</AdminShell>
    </AdminAuthProvider>
  );
}
