"use client";

import { use, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { Project } from "@/types";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ProjectForm } from "@/components/admin/projects/project-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    void apiFetch<Project>(`/projects/admin/${id}`).then(setProject);
  }, [id]);

  return (
    <div>
      <AdminPageHeader title="Edit Project" description="Update project details." />
      {project ? <ProjectForm project={project} /> : <Skeleton className="h-96 w-full" />}
    </div>
  );
}
