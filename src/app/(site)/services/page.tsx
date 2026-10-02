import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getServices, getSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { SectionHeading } from "@/components/shared/section-heading";
import { CtaSection } from "@/components/shared/cta-section";
import { buildWhatsAppUrl, generalEnquiryMessage } from "@/lib/whatsapp";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Solar Services | Bhanvi Solar",
    description: "Explore residential, commercial, installation, maintenance and consultation solar services.",
    path: "/services",
  });
}

export default async function ServicesPage() {
  const [services, settings] = await Promise.all([getServices(), getSettings()]);
  const whatsappUrl = buildWhatsAppUrl(settings.whatsapp, generalEnquiryMessage(settings.companyName));

  return (
    <div className="container-page flex flex-col gap-16 py-20">
      <SectionHeading
        eyebrow="Services"
        title="Solar services for every need"
        description="From first consultation through installation and ongoing maintenance, we support the full lifecycle of your solar system."
        align="center"
        className="mx-auto items-center text-center"
      />

      {services.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service._id}
              href={`/services/${service.slug}`}
              className="group flex flex-col gap-3 rounded-2xl border border-border bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <h2 className="font-display text-lg font-semibold text-ink-950">{service.name}</h2>
              <p className="text-sm text-muted-foreground">{service.shortDescription}</p>
              <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-medium text-energy-600">
                Learn more <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-mist-50 p-12 text-center">
          <p className="text-sm text-muted-foreground">Services will appear here once added from the admin panel.</p>
        </div>
      )}

      <CtaSection
        title="Not sure which service you need?"
        description="Talk to our team and we'll help you find the right solution."
        whatsappUrl={whatsappUrl}
      />
    </div>
  );
}
