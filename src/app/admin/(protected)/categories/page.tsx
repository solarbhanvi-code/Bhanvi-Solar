"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { apiFetch, ApiError } from "@/lib/api";
import type { Category } from "@/types";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

const categorySchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  description: z.string().trim().max(500).optional().or(z.literal("")),
});
type CategoryFormValues = z.infer<typeof categorySchema>;

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [reassignTarget, setReassignTarget] = useState<Record<string, string>>({});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({ resolver: zodResolver(categorySchema) });

  async function loadCategories() {
    setLoading(true);
    const data = await apiFetch<Category[]>("/categories");
    setCategories(data);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount
    void loadCategories();
  }, []);

  function openCreate() {
    setEditing(null);
    reset({ name: "", description: "" });
    setDialogOpen(true);
  }

  function openEdit(category: Category) {
    setEditing(category);
    reset({ name: category.name, description: category.description ?? "" });
    setDialogOpen(true);
  }

  async function onSubmit(values: CategoryFormValues) {
    try {
      if (editing) {
        await apiFetch(`/categories/${editing._id}`, { method: "PATCH", body: JSON.stringify(values) });
        toast.success("Category updated");
      } else {
        await apiFetch("/categories", { method: "POST", body: JSON.stringify(values) });
        toast.success("Category created");
      }
      setDialogOpen(false);
      await loadCategories();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Something went wrong");
    }
  }

  async function handleDelete(category: Category) {
    try {
      const reassignTo = reassignTarget[category._id];
      const qs = reassignTo ? `?reassignTo=${reassignTo}` : "";
      await apiFetch(`/categories/${category._id}${qs}`, { method: "DELETE" });
      toast.success("Category deleted");
      await loadCategories();
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Could not delete category",
      );
      throw error;
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Categories"
        description="Manage product categories."
        action={
          <Button variant="solar" onClick={openCreate}>
            <Plus /> New Category
          </Button>
        }
      />

      <div className="rounded-2xl border border-border bg-white">
        {loading ? (
          <div className="p-6">
            <Skeleton className="h-40 w-full" />
          </div>
        ) : categories.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">No categories yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category._id}>
                  <TableCell className="font-medium text-ink-950">{category.name}</TableCell>
                  <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">
                    {category.description || "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEdit(category)}>
                        <Pencil className="size-3.5" />
                      </Button>
                      <ConfirmDialog
                        trigger={
                          <Button variant="destructive" size="sm">
                            <Trash2 className="size-3.5" />
                          </Button>
                        }
                        title={`Delete "${category.name}"?`}
                        description="If products still use this category, choose a category to reassign them to below, or the deletion will be blocked."
                        onConfirm={() => handleDelete(category)}
                      >
                        <div className="mt-3">
                          <Label className="text-xs">Reassign products to (optional)</Label>
                          <Select
                            value={reassignTarget[category._id] ?? ""}
                            onValueChange={(value) =>
                              setReassignTarget((prev) => ({ ...prev, [category._id]: value }))
                            }
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="None" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories
                                .filter((c) => c._id !== category._id)
                                .map((c) => (
                                  <SelectItem key={c._id} value={c._id}>
                                    {c.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </ConfirmDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Category" : "New Category"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" {...register("name")} aria-invalid={!!errors.name} />
              {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={3} {...register("description")} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="solar" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="animate-spin" />}
                {editing ? "Save changes" : "Create category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
