"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { apiFetch, ApiError } from "@/lib/api";
import type { Paginated, Project } from "@/types";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminProjectsPage() {
  const [data, setData] = useState<Paginated<Project> | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setData(await apiFetch<Paginated<Project>>("/projects/admin/all?limit=50"));
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount
    void load();
  }, []);

  async function handleDelete(id: string) {
    try {
      await apiFetch(`/projects/${id}`, { method: "DELETE" });
      toast.success("Project deleted");
      await load();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Could not delete project");
      throw error;
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Projects"
        description="Manage your project gallery."
        action={
          <Button asChild variant="solar">
            <Link href="/admin/projects/new">
              <Plus /> New Project
            </Link>
          </Button>
        }
      />

      <div className="rounded-2xl border border-border bg-white">
        {loading || !data ? (
          <div className="p-6">
            <Skeleton className="h-64 w-full" />
          </div>
        ) : data.items.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">No projects yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((project) => (
                <TableRow key={project._id}>
                  <TableCell className="font-medium text-ink-950">
                    <div className="flex items-center gap-2">
                      {project.name}
                      {project.featured && <Badge variant="solar">Featured</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{project.projectType}</TableCell>
                  <TableCell className="text-muted-foreground">{project.location}</TableCell>
                  <TableCell>
                    <Badge variant={project.isActive ? "energy" : "muted"}>
                      {project.isActive ? "Published" : "Hidden"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/projects/${project._id}/edit`}>
                          <Pencil className="size-3.5" />
                        </Link>
                      </Button>
                      <ConfirmDialog
                        trigger={
                          <Button variant="destructive" size="sm">
                            <Trash2 className="size-3.5" />
                          </Button>
                        }
                        title={`Delete "${project.name}"?`}
                        description="This action cannot be undone."
                        onConfirm={() => handleDelete(project._id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
