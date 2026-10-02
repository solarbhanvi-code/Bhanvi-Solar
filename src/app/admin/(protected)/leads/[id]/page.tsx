"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { apiFetch, ApiError } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Lead, LeadStatus } from "@/types";
import { LeadStatusBadge, LEAD_STATUS_OPTIONS } from "@/components/admin/leads/lead-status-badge";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function DetailRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm text-ink-950">{value}</p>
    </div>
  );
}

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [note, setNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  async function load() {
    setLead(await apiFetch<Lead>(`/leads/${id}`));
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleStatusChange(status: LeadStatus) {
    setUpdatingStatus(true);
    try {
      await apiFetch(`/leads/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
      toast.success("Status updated");
      await load();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Could not update status");
    } finally {
      setUpdatingStatus(false);
    }
  }

  async function handleAddNote() {
    if (!note.trim()) return;
    setSavingNote(true);
    try {
      await apiFetch(`/leads/${id}/notes`, { method: "POST", body: JSON.stringify({ text: note.trim() }) });
      setNote("");
      await load();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Could not add note");
    } finally {
      setSavingNote(false);
    }
  }

  async function handleDelete() {
    try {
      await apiFetch(`/leads/${id}`, { method: "DELETE" });
      toast.success("Lead deleted");
      router.push("/admin/leads");
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Could not delete lead");
      throw error;
    }
  }

  if (!lead) {
    return <Skeleton className="h-96 w-full" />;
  }

  return (
    <div>
      <Link href="/admin/leads" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-ink-950">
        <ArrowLeft className="size-4" /> Back to leads
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-white p-6 lg:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-xl font-bold text-ink-950">{lead.name}</h1>
              <p className="text-sm text-muted-foreground">Submitted {formatDate(lead.createdAt)}</p>
            </div>
            <LeadStatusBadge status={lead.status} />
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <DetailRow label="Phone" value={lead.phone} />
            <DetailRow label="Email" value={lead.email} />
            <DetailRow label="City" value={lead.city} />
            <DetailRow label="Property Type" value={lead.propertyType} />
            <DetailRow label="Monthly Bill" value={lead.monthlyBill ? formatCurrency(lead.monthlyBill) : undefined} />
            <DetailRow label="Interest" value={lead.interest} />
            <DetailRow label="Source" value={lead.source} />
          </div>

          {lead.message && (
            <div className="mt-6">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Message</p>
              <p className="mt-1 whitespace-pre-line text-sm text-ink-950">{lead.message}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-border bg-white p-6">
            <p className="text-sm font-semibold text-ink-950">Status</p>
            <Select value={lead.status} onValueChange={(v) => void handleStatusChange(v as LeadStatus)} disabled={updatingStatus}>
              <SelectTrigger className="mt-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LEAD_STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <ConfirmDialog
              trigger={
                <Button variant="destructive" className="mt-4 w-full">
                  <Trash2 className="size-4" /> Delete Lead
                </Button>
              }
              title="Delete this lead?"
              description="This action cannot be undone."
              onConfirm={handleDelete}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-white p-6">
        <p className="text-sm font-semibold text-ink-950">Internal Notes</p>
        <div className="mt-4 flex flex-col gap-3">
          {lead.notes.length === 0 ? (
            <p className="text-sm text-muted-foreground">No notes yet.</p>
          ) : (
            lead.notes
              .slice()
              .reverse()
              .map((n, i) => (
                <div key={i} className="rounded-xl bg-mist-50 p-3 text-sm">
                  <p className="text-ink-950">{n.text}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{formatDate(n.createdAt)}</p>
                </div>
              ))
          )}
        </div>
        <div className="mt-4 flex gap-2">
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note..." rows={2} className="flex-1" />
          <Button type="button" onClick={() => void handleAddNote()} disabled={savingNote || !note.trim()}>
            {savingNote ? <Loader2 className="animate-spin" /> : <Send />}
          </Button>
        </div>
      </div>
    </div>
  );
}
