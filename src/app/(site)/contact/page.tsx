import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { getSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { SectionHeading } from "@/components/shared/section-heading";
import { QuoteForm } from "@/components/shared/quote-form";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { buildWhatsAppUrl, generalEnquiryMessage } from "@/lib/whatsapp";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Contact Us | Bhanvi Solar",
    description: "Get in touch with Bhanvi Solar for a free quote or to learn more about our solar solutions.",
    path: "/contact",
  });
}

export default async function ContactPage() {
  const settings = await getSettings();
  const whatsappUrl = buildWhatsAppUrl(settings.whatsapp, generalEnquiryMessage(settings.companyName));

  return (
    <div className="container-page flex flex-col gap-14 py-20">
      <SectionHeading
        eyebrow="Contact"
        title="Get in touch"
        description="Have a question or ready for a quote? Reach out and our team will respond shortly."
      />

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-1">
          {settings.phone && (
            <a href={`tel:${settings.phone}`} className="flex items-start gap-3 rounded-2xl border border-border bg-white p-5 shadow-sm">
              <Phone className="mt-0.5 size-5 shrink-0 text-solar-600" />
              <div>
                <p className="text-sm font-semibold text-ink-950">Phone</p>
                <p className="text-sm text-muted-foreground">{settings.phone}</p>
              </div>
            </a>
          )}
          {settings.email && (
            <a href={`mailto:${settings.email}`} className="flex items-start gap-3 rounded-2xl border border-border bg-white p-5 shadow-sm">
              <Mail className="mt-0.5 size-5 shrink-0 text-solar-600" />
              <div>
                <p className="text-sm font-semibold text-ink-950">Email</p>
                <p className="text-sm text-muted-foreground">{settings.email}</p>
              </div>
            </a>
          )}
          {settings.address && (
            <div className="flex items-start gap-3 rounded-2xl border border-border bg-white p-5 shadow-sm">
              <MapPin className="mt-0.5 size-5 shrink-0 text-solar-600" />
              <div>
                <p className="text-sm font-semibold text-ink-950">Address</p>
                <p className="text-sm text-muted-foreground">{settings.address}</p>
              </div>
            </div>
          )}
          {settings.businessHours && (
            <div className="flex items-start gap-3 rounded-2xl border border-border bg-white p-5 shadow-sm">
              <Clock className="mt-0.5 size-5 shrink-0 text-solar-600" />
              <div>
                <p className="text-sm font-semibold text-ink-950">Business Hours</p>
                <p className="text-sm text-muted-foreground">{settings.businessHours}</p>
              </div>
            </div>
          )}

          <WhatsAppButton url={whatsappUrl} className="w-full" />

          {settings.googleMapsUrl && (
            <div className="overflow-hidden rounded-2xl border border-border">
              <iframe
                src={settings.googleMapsUrl}
                title="Location map"
                className="h-64 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="font-display text-lg font-semibold text-ink-950">Send us a message</h2>
          <p className="mt-1 text-sm text-muted-foreground">Fill in the form and we&apos;ll get back to you shortly.</p>
          <QuoteForm className="mt-6" source="contact-page" />
        </div>
      </div>
    </div>
  );
}
