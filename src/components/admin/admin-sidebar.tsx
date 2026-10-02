"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ImageIcon,
  Users,
  Wrench,
  Star,
  HelpCircle,
  Settings as SettingsIcon,
  Sun,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "@/components/admin/auth-provider";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/projects", label: "Projects", icon: ImageIcon },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/testimonials", label: "Testimonials", icon: Star },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/settings", label: "Settings", icon: SettingsIcon },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useAdminAuth();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-5 py-6">
        <span className="flex size-9 items-center justify-center rounded-full bg-solar-500/15 text-solar-400">
          <Sun className="size-5" />
        </span>
        <span className="font-display text-base font-bold text-white">Bhanvi Solar</span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white",
              )}
            >
              <item.icon className="size-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white"
        >
          <ExternalLink className="size-5" />
          View site
        </Link>
        <div className="mt-2 flex items-center justify-between gap-2 rounded-xl px-3 py-2.5">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">{user?.name}</p>
            <p className="truncate text-xs text-white/40">{user?.email}</p>
          </div>
          <button
            type="button"
            onClick={() => void logout()}
            aria-label="Log out"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-white/50 hover:bg-white/10 hover:text-white"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <aside className="hidden w-64 shrink-0 bg-ink-950 lg:block">
        <SidebarContent />
      </aside>

      <div className="flex items-center justify-between border-b border-border bg-white px-4 py-3 lg:hidden">
        <span className="font-display text-sm font-bold text-ink-950">Bhanvi Solar Admin</span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="flex size-9 items-center justify-center rounded-lg border border-border"
        >
          <Menu className="size-4" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-ink-950/50"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 bg-ink-950 shadow-xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-4 flex size-8 items-center justify-center rounded-lg text-white/60 hover:bg-white/10"
            >
              <X className="size-4" />
            </button>
            <SidebarContent onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
