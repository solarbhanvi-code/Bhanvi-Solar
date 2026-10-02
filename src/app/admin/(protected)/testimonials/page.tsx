"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { apiFetch, ApiError } from "@/lib/api";
import type { Testimonial } from "@/types";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const testimonialSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  location: z.string().trim().max(100).optional().or(z.literal("")),
  message: z.string().trim().min(5, "Message is required").max(1000),
  rating: z.string().optional(),
});
type TestimonialFormValues = z.infer<typeof testimonialSchema>;

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [published, setPublished] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TestimonialFormValues>({ resolver: zodResolver(testimonialSchema) });
  const rating = watch("rating");

  async function load() {
    setLoading(true);
    setTestimonials(await apiFetch<Testimonial[]>("/testimonials/admin/all"));
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  function openCreate() {
    setEditing(null);
    setPublished(true);
    reset({ name: "", location: "", message: "", rating: "5" });
    setDialogOpen(true);
  }

  function openEdit(testimonial: Testimonial) {
    setEditing(testimonial);
    setPublished(testimonial.published);
    reset({
      name: testimonial.name,
      location: testimonial.location ?? "",
      message: testimonial.message,
      rating: testimonial.rating ? String(testimonial.rating) : "",
    });
    setDialogOpen(true);
  }

  async function onSubmit(values: TestimonialFormValues) {
    const payload = {
      name: values.name,
      location: values.location || undefined,
      message: values.message,
      rating: values.rating ? Number(values.rating) : undefined,
      published,
    };
    try {
      if (editing) {
        await apiFetch(`/testimonials/${editing._id}`, { method: "PATCH", body: JSON.stringify(payload) });
        toast.success("Testimonial updated");
      } else {
        await apiFetch("/testimonials", { method: "POST", body: JSON.stringify(payload) });
        toast.success("Testimonial created");
      }
      setDialogOpen(false);
      await load();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Something went wrong");
    }
  }

  async function handleDelete(testimonial: Testimonial) {
    try {
      await apiFetch(`/testimonials/${testimonial._id}`, { method: "DELETE" });
      toast.success("Testimonial deleted");
      await load();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Could not delete testimonial");
      throw error;
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Testimonials"
        description="Manage customer testimonials shown on your website."
        action={
          <Button variant="solar" onClick={openCreate}>
            <Plus /> New Testimonial
          </Button>
        }
      />

      {loading ? (
        <Skeleton className="h-64 w-full" />
      ) : testimonials.length === 0 ? (
        <p className="text-sm text-muted-foreground">No testimonials yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial._id} className="rounded-2xl border border-border bg-white p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-display text-sm font-semibold text-ink-950">{testimonial.name}</h3>
                  {testimonial.location && <p className="text-xs text-muted-foreground">{testimonial.location}</p>}
                </div>
                <Badge variant={testimonial.published ? "energy" : "muted"}>
                  {testimonial.published ? "Published" : "Draft"}
                </Badge>
              </div>
              {testimonial.rating && (
                <div className="mt-2 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`size-3.5 ${i < testimonial.rating! ? "fill-solar-500 text-solar-500" : "text-mist-300"}`} />
                  ))}
                </div>
              )}
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{testimonial.message}</p>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEdit(testimonial)}>
                  <Pencil className="size-3.5" /> Edit
                </Button>
                <ConfirmDialog
                  trigger={
                    <Button variant="destructive" size="sm">
                      <Trash2 className="size-3.5" />
                    </Button>
                  }
                  title={`Delete testimonial from "${testimonial.name}"?`}
                  description="This action cannot be undone."
                  onConfirm={() => handleDelete(testimonial)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Testimonial" : "New Testimonial"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" {...register("name")} aria-invalid={!!errors.name} />
                {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="location">Location</Label>
                <Input id="location" {...register("location")} />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="message">Message *</Label>
              <Textarea id="message" rows={4} {...register("message")} aria-invalid={!!errors.message} />
              {errors.message && <p className="text-xs text-red-600">{errors.message.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Rating</Label>
              <Select value={rating} onValueChange={(v) => setValue("rating", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 4, 3, 2, 1].map((r) => (
                    <SelectItem key={r} value={String(r)}>
                      {r} stars
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={published} onCheckedChange={setPublished} id="published" />
              <Label htmlFor="published">Published (visible on site)</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="solar" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="animate-spin" />}
                {editing ? "Save changes" : "Create testimonial"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
