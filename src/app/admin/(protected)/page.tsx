"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FolderTree, HelpCircle, ImageIcon, Package, Star, Users } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Lead, Paginated } from "@/types";

interface DashboardCounts {
  products: number;
  categories: number;
  projects: number;
  leads: number;
  newLeads: number;
  testimonials: number;
  faqs: number;
}

const STATUS_VARIANT: Record<Lead["status"], "default" | "solar" | "energy" | "muted" | "destructive"> = {
  NEW: "solar",
  CONTACTED: "default",
  QUALIFIED: "default",
  SITE_VISIT: "default",
  QUOTATION_SENT: "energy",
  WON: "energy",
  LOST: "destructive",
};

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState<DashboardCounts | null>(null);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [products, categories, projects, leads, newLeads, testimonials, faqs] = await Promise.all([
        apiFetch<Paginated<unknown>>("/products/admin/all?limit=1"),
        apiFetch<unknown[]>("/categories"),
        apiFetch<Paginated<unknown>>("/projects/admin/all?limit=1"),
        apiFetch<Paginated<Lead>>("/leads?limit=5"),
        apiFetch<Paginated<Lead>>("/leads?status=NEW&limit=1"),
        apiFetch<unknown[]>("/testimonials/admin/all"),
        apiFetch<unknown[]>("/faqs/admin/all"),
      ]);

      setCounts({
        products: products.total,
        categories: categories.length,
        projects: projects.total,
        leads: leads.total,
        newLeads: newLeads.total,
        testimonials: testimonials.length,
        faqs: faqs.length,
      });
      setRecentLeads(leads.items);
      setLoading(false);
    }
    void load();
  }, []);

  const cards = [
    { label: "Products", value: counts?.products, href: "/admin/products", icon: Package },
    { label: "Categories", value: counts?.categories, href: "/admin/categories", icon: FolderTree },
    { label: "Projects", value: counts?.projects, href: "/admin/projects", icon: ImageIcon },
    { label: "Leads", value: counts?.leads, href: "/admin/leads", icon: Users },
    { label: "New Leads", value: counts?.newLeads, href: "/admin/leads?status=NEW", icon: Users },
    { label: "Testimonials", value: counts?.testimonials, href: "/admin/testimonials", icon: Star },
    { label: "FAQs", value: counts?.faqs, href: "/admin/faqs", icon: HelpCircle },
  ];

  return (
    <div>
      <AdminPageHeader title="Dashboard" description="An overview of your Bhanvi Solar website." />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-solar-500/10 text-solar-600">
                  <card.icon className="size-5" />
                </span>
                <div>
                  {loading ? (
                    <Skeleton className="h-6 w-10" />
                  ) : (
                    <p className="font-display text-xl font-bold text-ink-950">{card.value ?? "--"}</p>
                  )}
                  <p className="text-xs text-muted-foreground">{card.label}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="font-display text-lg font-semibold text-ink-950">Recent Leads</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-white">
          {loading ? (
            <div className="p-6">
              <Skeleton className="h-32 w-full" />
            </div>
          ) : recentLeads.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">No leads yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {recentLeads.map((lead) => (
                <li key={lead._id}>
                  <Link href={`/admin/leads/${lead._id}`} className="flex items-center justify-between gap-4 p-4 hover:bg-mist-50">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink-950">{lead.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {lead.phone} · {formatDate(lead.createdAt)}
                      </p>
                    </div>
                    <Badge variant={STATUS_VARIANT[lead.status]}>{lead.status.replace("_", " ")}</Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
