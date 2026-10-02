"use client";

import { Loader2 } from "lucide-react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { useAdminAuth } from "@/components/admin/auth-provider";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAdminAuth();

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mist-50">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-mist-50 lg:flex-row flex-col">
      <AdminSidebar />
      <div className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8">{children}</div>
      </div>
    </div>
  );
}
