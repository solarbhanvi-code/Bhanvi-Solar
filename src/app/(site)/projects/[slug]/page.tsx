import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Calendar, MapPin, Zap } from "lucide-react";
import { getProjectBySlug, getSettings } from "@/lib/data";
import { buildMetadata, siteUrl } from "@/lib/seo";
import { formatCurrency, formatDate, formatNumber } from "@/lib/utils";
import { buildWhatsAppUrl, projectEnquiryMessage } from "@/lib/whatsapp";
import { Badge } from "@/components/ui/badge";
import { ImageGallery } from "@/components/shared/image-gallery";
import { CtaSection } from "@/components/shared/cta-section";

interface PageParams {
  params: Promise<{ slug: string }>;
}

const TYPE_LABEL: Record<string, string> = {
  RESIDENTIAL: "Residential",
  COMMERCIAL: "Commercial",
  INDUSTRIAL: "Industrial",
};

const STAGE_LABEL: Record<string, string> = {
  BEFORE: "Before",
  INSTALLATION: "Installation",
  COMPLETED: "Completed",
};

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return buildMetadata({
    title: project.seo?.title ?? `${project.name} | Bhanvi Solar Projects`,
    description: project.seo?.description ?? project.description,
    path: `/projects/${project.slug}`,
    seo: project.seo,
    image: project.images[0]?.url,
  });
}

export default async function ProjectDetailPage({ params }: PageParams) {
  const { slug } = await params;
  const [project, settings] = await Promise.all([getProjectBySlug(slug), getSettings()]);
  if (!project) notFound();

  const whatsappUrl = buildWhatsAppUrl(settings.whatsapp, projectEnquiryMessage(project.name));

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Projects", item: siteUrl("/projects") },
      { "@type": "ListItem", position: 2, name: project.name, item: siteUrl(`/projects/${project.slug}`) },
    ],
  };

  return (
    <div className="container-page flex flex-col gap-14 py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="grid gap-12 lg:grid-cols-2">
        <ImageGallery
          images={project.images.map((img) => ({
            url: img.url,
            alt: img.alt,
            caption: STAGE_LABEL[img.stage],
          }))}
          name={project.name}
        />

        <div className="flex flex-col gap-5">
          <Badge className="w-fit">{TYPE_LABEL[project.projectType]}</Badge>
          <h1 className="font-display text-3xl font-bold text-ink-950 sm:text-4xl">{project.name}</h1>

          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border bg-mist-50 p-5 sm:grid-cols-3">
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <MapPin className="size-3.5" /> Location
              </span>
              <span className="text-sm font-semibold text-ink-950">{project.location}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Zap className="size-3.5" /> Capacity
              </span>
              <span className="text-sm font-semibold text-ink-950">{project.capacity}</span>
            </div>
            {project.installationDate && (
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Calendar className="size-3.5" /> Installed
                </span>
                <span className="text-sm font-semibold text-ink-950">{formatDate(project.installationDate)}</span>
              </div>
            )}
          </div>

          <p className="whitespace-pre-line text-base leading-relaxed text-muted-foreground">
            {project.description}
          </p>

          {project.generationData &&
            (project.generationData.annualGenerationKwh || project.generationData.annualSavings) && (
              <div className="grid grid-cols-2 gap-4 rounded-2xl border border-energy-500/20 bg-energy-500/5 p-5">
                {project.generationData.annualGenerationKwh && (
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">Annual Generation</span>
                    <p className="font-display text-lg font-semibold text-ink-950">
                      {formatNumber(project.generationData.annualGenerationKwh)} kWh
                    </p>
                  </div>
                )}
                {project.generationData.annualSavings && (
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">Annual Savings</span>
                    <p className="font-display text-lg font-semibold text-ink-950">
                      {formatCurrency(project.generationData.annualSavings)}
                    </p>
                  </div>
                )}
              </div>
            )}
        </div>
      </div>

      <CtaSection
        title="Want a similar system for your property?"
        description="Talk to our team and get a free, no-obligation quote."
        whatsappUrl={whatsappUrl}
      />
    </div>
  );
}
