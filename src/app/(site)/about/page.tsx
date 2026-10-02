import type { Metadata } from "next";
import { BadgeCheck, Handshake, ShieldCheck, Wrench } from "lucide-react";
import { getSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { SectionHeading } from "@/components/shared/section-heading";
import { CtaSection } from "@/components/shared/cta-section";
import { buildWhatsAppUrl, generalEnquiryMessage } from "@/lib/whatsapp";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata({
    title: `About Us | ${settings.companyName}`,
    description: settings.aboutText ?? settings.tagline,
    path: "/about",
  });
}

const VALUES = [
  { icon: BadgeCheck, title: "Quality first", description: "We work with dependable products and back every installation with clear specifications." },
  { icon: Wrench, title: "Craftsmanship", description: "Our installation teams follow structured, safety-first processes on every site." },
  { icon: ShieldCheck, title: "Transparency", description: "No hidden costs — you get a clear quote before any work begins." },
  { icon: Handshake, title: "Long-term relationships", description: "We aim to stay your solar partner well beyond installation day." },
];

export default async function AboutPage() {
  const settings = await getSettings();
  const whatsappUrl = buildWhatsAppUrl(settings.whatsapp, generalEnquiryMessage(settings.companyName));

  return (
    <div className="container-page flex flex-col gap-20 py-20">
      <section className="mx-auto max-w-3xl text-center">
        <SectionHeading
          eyebrow="About Us"
          title={`About ${settings.companyName}`}
          description={settings.aboutText ?? settings.tagline}
          align="center"
          className="mx-auto items-center"
        />
      </section>

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {VALUES.map((value) => (
          <div key={value.title} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <span className="flex size-11 items-center justify-center rounded-xl bg-energy-500/10 text-energy-600">
              <value.icon className="size-5" />
            </span>
            <h3 className="mt-4 font-display text-base font-semibold text-ink-950">{value.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{value.description}</p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl bg-mist-100 p-10 sm:p-14">
        <SectionHeading
          eyebrow="Our Approach"
          title="How we work with you"
          description="A straightforward process from first enquiry to a completed installation."
        />
        <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { step: "01", title: "Enquiry", description: "Share your requirement via the quote form, phone or WhatsApp." },
            { step: "02", title: "Site Assessment", description: "We evaluate your roof, consumption and requirements." },
            { step: "03", title: "Proposal", description: "You receive a clear, itemized quote and system design." },
            { step: "04", title: "Installation", description: "Our certified team installs and commissions the system." },
          ].map((item) => (
            <li key={item.step} className="flex flex-col gap-2">
              <span className="font-display text-3xl font-bold text-solar-500">{item.step}</span>
              <h3 className="font-display text-sm font-semibold text-ink-950">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <CtaSection
        title="Ready to Make the Switch to Solar?"
        description="Talk to our team and get a free, no-obligation quote for your home or business."
        whatsappUrl={whatsappUrl}
      />
    </div>
  );
}
