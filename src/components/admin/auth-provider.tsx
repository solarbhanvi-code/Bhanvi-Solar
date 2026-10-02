"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import type { AuthUser } from "@/types";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      try {
        const res = await apiFetch<{ user: AuthUser }>("/auth/me");
        if (!cancelled) setUser(res.user);
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          try {
            await apiFetch("/auth/refresh", { method: "POST" });
            const res = await apiFetch<{ user: AuthUser }>("/auth/me");
            if (!cancelled) setUser(res.user);
          } catch {
            if (!cancelled) router.replace("/admin/login");
          }
        } else if (!cancelled) {
          router.replace("/admin/login");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadUser();
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function logout() {
    await apiFetch("/auth/logout", { method: "POST" }).catch(() => undefined);
    setUser(null);
    router.replace("/admin/login");
  }

  return <AuthContext.Provider value={{ user, loading, logout }}>{children}</AuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
