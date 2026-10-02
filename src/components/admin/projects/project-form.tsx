"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { apiFetch, ApiError } from "@/lib/api";
import type { Project, ProjectImage, ProjectType } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProjectImageUploader } from "@/components/admin/projects/project-image-uploader";

const projectSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(150),
  location: z.string().trim().min(1, "Location is required").max(150),
  capacity: z.string().trim().min(1, "Capacity is required").max(50),
  description: z.string().trim().min(10, "Description is required"),
  installationDate: z.string().optional(),
  annualGenerationKwh: z.string().optional(),
  annualSavings: z.string().optional(),
  seoTitle: z.string().trim().max(70).optional().or(z.literal("")),
  seoDescription: z.string().trim().max(160).optional().or(z.literal("")),
});
type ProjectFormValues = z.infer<typeof projectSchema>;

export function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter();
  const [images, setImages] = useState<ProjectImage[]>(project?.images ?? []);
  const [projectType, setProjectType] = useState<ProjectType>(project?.projectType ?? "RESIDENTIAL");
  const [featured, setFeatured] = useState(project?.featured ?? false);
  const [isActive, setIsActive] = useState(project?.isActive ?? true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project?.name ?? "",
      location: project?.location ?? "",
      capacity: project?.capacity ?? "",
      description: project?.description ?? "",
      installationDate: project?.installationDate ? project.installationDate.slice(0, 10) : "",
      annualGenerationKwh: project?.generationData?.annualGenerationKwh
        ? String(project.generationData.annualGenerationKwh)
        : "",
      annualSavings: project?.generationData?.annualSavings ? String(project.generationData.annualSavings) : "",
      seoTitle: project?.seo?.title ?? "",
      seoDescription: project?.seo?.description ?? "",
    },
  });

  async function onSubmit(values: ProjectFormValues) {
    const payload = {
      name: values.name,
      location: values.location,
      capacity: values.capacity,
      projectType,
      description: values.description,
      installationDate: values.installationDate || undefined,
      images,
      featured,
      isActive,
      generationData: {
        annualGenerationKwh: values.annualGenerationKwh ? Number(values.annualGenerationKwh) : undefined,
        annualSavings: values.annualSavings ? Number(values.annualSavings) : undefined,
      },
      seo: {
        title: values.seoTitle || undefined,
        description: values.seoDescription || undefined,
      },
    };

    try {
      if (project) {
        await apiFetch(`/projects/${project._id}`, { method: "PATCH", body: JSON.stringify(payload) });
        toast.success("Project updated");
      } else {
        await apiFetch("/projects", { method: "POST", body: JSON.stringify(payload) });
        toast.success("Project created");
      }
      router.push("/admin/projects");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Something went wrong");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8" noValidate>
      <section className="rounded-2xl border border-border bg-white p-6">
        <h2 className="font-display text-base font-semibold text-ink-950">Project Details</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="name">Project Name *</Label>
            <Input id="name" {...register("name")} aria-invalid={!!errors.name} />
            {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="location">Location *</Label>
            <Input id="location" {...register("location")} aria-invalid={!!errors.location} />
            {errors.location && <p className="text-xs text-red-600">{errors.location.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="capacity">Capacity *</Label>
            <Input id="capacity" placeholder="e.g. 5 kW" {...register("capacity")} aria-invalid={!!errors.capacity} />
            {errors.capacity && <p className="text-xs text-red-600">{errors.capacity.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="projectType">Project Type</Label>
            <Select value={projectType} onValueChange={(v) => setProjectType(v as ProjectType)}>
              <SelectTrigger id="projectType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RESIDENTIAL">Residential</SelectItem>
                <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                <SelectItem value="INDUSTRIAL">Industrial</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="installationDate">Installation Date</Label>
            <Input id="installationDate" type="date" {...register("installationDate")} />
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" rows={5} {...register("description")} aria-invalid={!!errors.description} />
            {errors.description && <p className="text-xs text-red-600">{errors.description.message}</p>}
          </div>
        </div>
        <div className="mt-5 flex items-center gap-3">
          <Switch checked={featured} onCheckedChange={setFeatured} id="featured" />
          <Label htmlFor="featured">Featured on homepage</Label>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <Switch checked={isActive} onCheckedChange={setIsActive} id="isActive" />
          <Label htmlFor="isActive">Published (visible on site)</Label>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-white p-6">
        <h2 className="font-display text-base font-semibold text-ink-950">Images</h2>
        <p className="mt-1 text-xs text-muted-foreground">Tag each image as Before / Installation / Completed.</p>
        <div className="mt-5">
          <ProjectImageUploader images={images} onChange={setImages} />
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-white p-6">
        <h2 className="font-display text-base font-semibold text-ink-950">Generation & Savings (optional)</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="annualGenerationKwh">Annual Generation (kWh)</Label>
            <Input id="annualGenerationKwh" type="number" min={0} {...register("annualGenerationKwh")} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="annualSavings">Annual Savings</Label>
            <Input id="annualSavings" type="number" min={0} {...register("annualSavings")} />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-white p-6">
        <h2 className="font-display text-base font-semibold text-ink-950">SEO Metadata</h2>
        <div className="mt-5 grid gap-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="seoTitle">SEO Title</Label>
            <Input id="seoTitle" {...register("seoTitle")} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="seoDescription">SEO Description</Label>
            <Textarea id="seoDescription" rows={2} {...register("seoDescription")} />
          </div>
        </div>
      </section>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/projects")}>
          Cancel
        </Button>
        <Button type="submit" variant="solar" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="animate-spin" />}
          {project ? "Save changes" : "Create project"}
        </Button>
      </div>
    </form>
  );
}
