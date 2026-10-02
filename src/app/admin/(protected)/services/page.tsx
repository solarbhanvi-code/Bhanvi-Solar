"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { apiFetch, ApiError } from "@/lib/api";
import type { Service } from "@/types";
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

const serviceSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(150),
  shortDescription: z.string().trim().min(2, "Short description is required").max(200),
  description: z.string().trim().min(10, "Description is required"),
  highlightsText: z.string().optional(),
  order: z.string().optional(),
});
type ServiceFormValues = z.infer<typeof serviceSchema>;

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [isActive, setIsActive] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormValues>({ resolver: zodResolver(serviceSchema) });

  async function load() {
    setLoading(true);
    setServices(await apiFetch<Service[]>("/services/admin/all"));
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount
    void load();
  }, []);

  function openCreate() {
    setEditing(null);
    setIsActive(true);
    reset({ name: "", shortDescription: "", description: "", highlightsText: "", order: "" });
    setDialogOpen(true);
  }

  function openEdit(service: Service) {
    setEditing(service);
    setIsActive(service.isActive);
    reset({
      name: service.name,
      shortDescription: service.shortDescription,
      description: service.description,
      highlightsText: service.highlights.join("\n"),
      order: String(service.order),
    });
    setDialogOpen(true);
  }

  async function onSubmit(values: ServiceFormValues) {
    const payload = {
      name: values.name,
      shortDescription: values.shortDescription,
      description: values.description,
      highlights: (values.highlightsText ?? "")
        .split("\n")
        .map((h) => h.trim())
        .filter(Boolean),
      order: values.order ? Number(values.order) : 0,
      isActive,
    };
    try {
      if (editing) {
        await apiFetch(`/services/${editing._id}`, { method: "PATCH", body: JSON.stringify(payload) });
        toast.success("Service updated");
      } else {
        await apiFetch("/services", { method: "POST", body: JSON.stringify(payload) });
        toast.success("Service created");
      }
      setDialogOpen(false);
      await load();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Something went wrong");
    }
  }

  async function handleDelete(service: Service) {
    try {
      await apiFetch(`/services/${service._id}`, { method: "DELETE" });
      toast.success("Service deleted");
      await load();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Could not delete service");
      throw error;
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Services"
        description="Manage the services shown on your website."
        action={
          <Button variant="solar" onClick={openCreate}>
            <Plus /> New Service
          </Button>
        }
      />

      {loading ? (
        <Skeleton className="h-64 w-full" />
      ) : services.length === 0 ? (
        <p className="text-sm text-muted-foreground">No services yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {services.map((service) => (
            <div key={service._id} className="rounded-2xl border border-border bg-white p-5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-base font-semibold text-ink-950">{service.name}</h3>
                <Badge variant={service.isActive ? "energy" : "muted"}>{service.isActive ? "Published" : "Hidden"}</Badge>
              </div>
              <p className="mt-1.5 text-sm text-muted-foreground">{service.shortDescription}</p>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEdit(service)}>
                  <Pencil className="size-3.5" /> Edit
                </Button>
                <ConfirmDialog
                  trigger={
                    <Button variant="destructive" size="sm">
                      <Trash2 className="size-3.5" />
                    </Button>
                  }
                  title={`Delete "${service.name}"?`}
                  description="This action cannot be undone."
                  onConfirm={() => handleDelete(service)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Service" : "New Service"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" {...register("name")} aria-invalid={!!errors.name} />
              {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="shortDescription">Short Description *</Label>
              <Input id="shortDescription" {...register("shortDescription")} aria-invalid={!!errors.shortDescription} />
              {errors.shortDescription && <p className="text-xs text-red-600">{errors.shortDescription.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="description">Description *</Label>
              <Textarea id="description" rows={4} {...register("description")} aria-invalid={!!errors.description} />
              {errors.description && <p className="text-xs text-red-600">{errors.description.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="highlightsText">Highlights (one per line)</Label>
              <Textarea id="highlightsText" rows={3} {...register("highlightsText")} />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={isActive} onCheckedChange={setIsActive} id="isActive" />
              <Label htmlFor="isActive">Published</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="solar" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="animate-spin" />}
                {editing ? "Save changes" : "Create service"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
