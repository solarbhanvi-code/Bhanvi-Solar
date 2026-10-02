import Image from "next/image";
import Link from "next/link";
import { MapPin, Sun, Zap } from "lucide-react";
import type { Project } from "@/types";
import { Badge } from "@/components/ui/badge";

const TYPE_LABEL: Record<Project["projectType"], string> = {
  RESIDENTIAL: "Residential",
  COMMERCIAL: "Commercial",
  INDUSTRIAL: "Industrial",
};

export function ProjectCard({ project }: { project: Project }) {
  const image = project.images.find((img) => img.stage === "COMPLETED") ?? project.images[0];

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink-900">
        {image ? (
          <Image
            src={image.url}
            alt={image.alt || project.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Sun className="size-10 text-white/20" />
          </div>
        )}
        <Badge className="absolute left-3 top-3">{TYPE_LABEL[project.projectType]}</Badge>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-display text-base font-semibold text-ink-950 line-clamp-2">
          {project.name}
        </h3>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3.5" /> {project.location}
          </span>
          <span className="inline-flex items-center gap-1">
            <Zap className="size-3.5" /> {project.capacity}
          </span>
        </div>
      </div>
    </Link>
  );
}
