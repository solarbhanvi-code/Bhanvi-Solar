"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { Lead, LeadStatus, Paginated } from "@/types";
import { AdminPageHeader } from "@/components/admin/page-header";
import { LeadStatusBadge, LEAD_STATUS_OPTIONS } from "@/components/admin/leads/lead-status-badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function AdminLeadsPageInner() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<Paginated<Lead> | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<LeadStatus | "all">(
    (searchParams.get("status") as LeadStatus | null) ?? "all",
  );
  const [page, setPage] = useState(1);

  async function load() {
    setLoading(true);
    const qs = new URLSearchParams({ page: String(page), limit: "15" });
    if (search) qs.set("search", search);
    if (status !== "all") qs.set("status", status);
    setData(await apiFetch<Paginated<Lead>>(`/leads?${qs.toString()}`));
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount/filter-change
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status]);

  return (
    <div>
      <AdminPageHeader title="Leads" description="Manage customer enquiries and quote requests." />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <form
          className="relative flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            void load();
          }}
        >
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, phone, email..." className="pl-10" />
        </form>
        <Select value={status} onValueChange={(v) => { setStatus(v as LeadStatus | "all"); setPage(1); }}>
          <SelectTrigger className="sm:w-56">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {LEAD_STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {s.replace("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-2xl border border-border bg-white">
        {loading || !data ? (
          <div className="p-6">
            <Skeleton className="h-64 w-full" />
          </div>
        ) : data.items.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">No leads found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Interest</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((lead) => (
                <TableRow key={lead._id} className="cursor-pointer">
                  <TableCell className="font-medium text-ink-950">
                    <Link href={`/admin/leads/${lead._id}`} className="block">
                      {lead.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{lead.phone}</TableCell>
                  <TableCell className="max-w-40 truncate text-muted-foreground">{lead.interest || "—"}</TableCell>
                  <TableCell>
                    <LeadStatusBadge status={lead.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(lead.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {data && data.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4 text-sm">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            Previous
          </Button>
          <span className="text-muted-foreground">
            Page {data.page} of {data.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= data.totalPages}
            onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

export default function AdminLeadsPage() {
  return (
    <Suspense>
      <AdminLeadsPageInner />
    </Suspense>
  );
}
