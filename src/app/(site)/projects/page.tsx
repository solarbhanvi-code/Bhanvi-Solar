import type { Metadata } from "next";
import { getProjects } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProjectCard } from "@/components/shared/project-card";
import { ProjectFilterTabs } from "@/components/projects/project-filter-tabs";
import { Pagination } from "@/components/ui/pagination";
import type { ProjectType } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Projects | Bhanvi Solar",
    description: "Browse completed residential, commercial and industrial solar installations.",
    path: "/projects",
  });
}

interface PageProps {
  searchParams: Promise<{ type?: ProjectType; page?: string }>;
}

export default async function ProjectsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page ?? "1") || 1;

  const projects = await getProjects({ projectType: params.type, page, limit: 9 });

  function buildHref(targetPage: number) {
    const sp = new URLSearchParams();
    if (params.type) sp.set("type", params.type);
    if (targetPage > 1) sp.set("page", String(targetPage));
    const qs = sp.toString();
    return qs ? `/projects?${qs}` : "/projects";
  }

  return (
    <div className="container-page flex flex-col gap-10 py-20">
      <SectionHeading
        eyebrow="Our Work"
        title="Projects & Gallery"
        description="A showcase of residential, commercial and industrial solar installations."
      />

      <ProjectFilterTabs />

      {projects.items.length > 0 ? (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.items.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
          <Pagination page={projects.page} totalPages={projects.totalPages} buildHref={buildHref} />
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-mist-50 p-16 text-center">
          <p className="text-sm text-muted-foreground">
            {params.type
              ? "No projects in this category yet."
              : "Projects will appear here once they're added from the admin panel."}
          </p>
        </div>
      )}
    </div>
  );
}
