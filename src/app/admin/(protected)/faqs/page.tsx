"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { apiFetch, ApiError } from "@/lib/api";
import type { Faq } from "@/types";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const faqSchema = z.object({
  question: z.string().trim().min(5, "Question is required"),
  answer: z.string().trim().min(5, "Answer is required"),
  category: z.string().trim().max(60).optional().or(z.literal("")),
});
type FaqFormValues = z.infer<typeof faqSchema>;

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Faq | null>(null);
  const [published, setPublished] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FaqFormValues>({ resolver: zodResolver(faqSchema) });

  async function load() {
    setLoading(true);
    setFaqs(await apiFetch<Faq[]>("/faqs/admin/all"));
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount
    void load();
  }, []);

  function openCreate() {
    setEditing(null);
    setPublished(true);
    reset({ question: "", answer: "", category: "" });
    setDialogOpen(true);
  }

  function openEdit(faq: Faq) {
    setEditing(faq);
    setPublished(faq.published);
    reset({ question: faq.question, answer: faq.answer, category: faq.category ?? "" });
    setDialogOpen(true);
  }

  async function onSubmit(values: FaqFormValues) {
    const payload = { question: values.question, answer: values.answer, category: values.category || undefined, published };
    try {
      if (editing) {
        await apiFetch(`/faqs/${editing._id}`, { method: "PATCH", body: JSON.stringify(payload) });
        toast.success("FAQ updated");
      } else {
        await apiFetch("/faqs", { method: "POST", body: JSON.stringify(payload) });
        toast.success("FAQ created");
      }
      setDialogOpen(false);
      await load();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Something went wrong");
    }
  }

  async function handleDelete(faq: Faq) {
    try {
      await apiFetch(`/faqs/${faq._id}`, { method: "DELETE" });
      toast.success("FAQ deleted");
      await load();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Could not delete FAQ");
      throw error;
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="FAQs"
        description="Manage frequently asked questions."
        action={
          <Button variant="solar" onClick={openCreate}>
            <Plus /> New FAQ
          </Button>
        }
      />

      {loading ? (
        <Skeleton className="h-64 w-full" />
      ) : faqs.length === 0 ? (
        <p className="text-sm text-muted-foreground">No FAQs yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {faqs.map((faq) => (
            <div key={faq._id} className="rounded-2xl border border-border bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-sm font-semibold text-ink-950">{faq.question}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{faq.answer}</p>
                </div>
                <Badge variant={faq.published ? "energy" : "muted"}>{faq.published ? "Published" : "Draft"}</Badge>
              </div>
              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEdit(faq)}>
                  <Pencil className="size-3.5" /> Edit
                </Button>
                <ConfirmDialog
                  trigger={
                    <Button variant="destructive" size="sm">
                      <Trash2 className="size-3.5" />
                    </Button>
                  }
                  title="Delete this FAQ?"
                  description="This action cannot be undone."
                  onConfirm={() => handleDelete(faq)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit FAQ" : "New FAQ"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="question">Question *</Label>
              <Input id="question" {...register("question")} aria-invalid={!!errors.question} />
              {errors.question && <p className="text-xs text-red-600">{errors.question.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="answer">Answer *</Label>
              <Textarea id="answer" rows={4} {...register("answer")} aria-invalid={!!errors.answer} />
              {errors.answer && <p className="text-xs text-red-600">{errors.answer.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="category">Category</Label>
              <Input id="category" {...register("category")} />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={published} onCheckedChange={setPublished} id="published" />
              <Label htmlFor="published">Published</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="solar" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="animate-spin" />}
                {editing ? "Save changes" : "Create FAQ"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
