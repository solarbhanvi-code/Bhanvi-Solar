import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { getServiceBySlug, getServices, getSettings } from "@/lib/data";
import { buildMetadata, siteUrl } from "@/lib/seo";
import { CtaSection } from "@/components/shared/cta-section";
import { buildWhatsAppUrl, generalEnquiryMessage } from "@/lib/whatsapp";
import { QuoteForm } from "@/components/shared/quote-form";

interface PageParams {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};
  return buildMetadata({
    title: service.seo?.title ?? `${service.name} | Bhanvi Solar`,
    description: service.seo?.description ?? service.shortDescription,
    path: `/services/${service.slug}`,
    seo: service.seo,
  });
}

export default async function ServiceDetailPage({ params }: PageParams) {
  const { slug } = await params;
  const [service, allServices, settings] = await Promise.all([
    getServiceBySlug(slug),
    getServices(),
    getSettings(),
  ]);
  if (!service) notFound();

  const whatsappUrl = buildWhatsAppUrl(settings.whatsapp, generalEnquiryMessage(settings.companyName));
  const otherServices = allServices.filter((s) => s.slug !== service.slug).slice(0, 4);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Services", item: siteUrl("/services") },
      { "@type": "ListItem", position: 2, name: service.name, item: siteUrl(`/services/${service.slug}`) },
    ],
  };

  return (
    <div className="container-page flex flex-col gap-16 py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-energy-600">Service</p>
          <h1 className="font-display mt-2 text-3xl font-bold text-ink-950 sm:text-4xl">{service.name}</h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{service.description}</p>

          {service.highlights.length > 0 && (
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {service.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-2 text-sm text-ink-800">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-energy-500" />
                  {highlight}
                </li>
              ))}
            </ul>
          )}

          {otherServices.length > 0 && (
            <div className="mt-12">
              <h2 className="font-display text-lg font-semibold text-ink-950">Other services</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {otherServices.map((s) => (
                  <Link
                    key={s._id}
                    href={`/services/${s.slug}`}
                    className="inline-flex items-center gap-1 rounded-full border border-border px-4 py-2 text-sm font-medium text-ink-950 transition-colors hover:bg-mist-100"
                  >
                    {s.name} <ArrowRight className="size-3.5" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h2 className="font-display text-lg font-semibold text-ink-950">Request a quote</h2>
          <p className="mt-1 text-sm text-muted-foreground">Tell us about your requirement and we&apos;ll get back to you.</p>
          <QuoteForm className="mt-6" defaultInterest={service.name} source={`service:${service.slug}`} />
        </div>
      </div>

      <CtaSection
        title="Ready to Make the Switch to Solar?"
        description="Talk to our team and get a free, no-obligation quote."
        whatsappUrl={whatsappUrl}
      />
    </div>
  );
}
