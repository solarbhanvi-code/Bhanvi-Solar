import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BatteryCharging,
  Leaf,
  Home as HomeIcon,
  TrendingDown,
  Unplug,
  Wallet,
} from "lucide-react";
import { getSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { SectionHeading } from "@/components/shared/section-heading";
import { CtaSection } from "@/components/shared/cta-section";
import { buildWhatsAppUrl, generalEnquiryMessage } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Why Solar | Bhanvi Solar",
    description: "Understand the benefits of installing solar at your home or business.",
    path: "/why-solar",
  });
}

const BENEFITS = [
  { icon: Wallet, title: "Lower electricity bills", description: "Generate your own power and reduce what you draw from the grid." },
  { icon: TrendingDown, title: "Long-term savings", description: "A solar system is a long-term investment against rising electricity costs." },
  { icon: Unplug, title: "Reduced grid dependence", description: "Rely less on grid power and its fluctuations." },
  { icon: Leaf, title: "Cleaner energy", description: "Solar generates electricity without ongoing emissions." },
  { icon: BatteryCharging, title: "Energy independence", description: "With battery storage, keep essential loads running during outages." },
  { icon: HomeIcon, title: "Property value", description: "A solar installation can be an attractive feature for future buyers." },
];

export default async function WhySolarPage() {
  const settings = await getSettings();
  const whatsappUrl = buildWhatsAppUrl(settings.whatsapp, generalEnquiryMessage(settings.companyName));

  return (
    <div className="container-page flex flex-col gap-16 py-20">
      <SectionHeading
        eyebrow="Why Solar"
        title="Why installing solar makes sense"
        description="Solar energy offers real, practical benefits for homes and businesses — without unrealistic promises."
        align="center"
        className="mx-auto items-center text-center"
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {BENEFITS.map((benefit) => (
          <div key={benefit.title} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <span className="flex size-11 items-center justify-center rounded-xl bg-solar-500/10 text-solar-600">
              <benefit.icon className="size-5" />
            </span>
            <h3 className="mt-4 font-display text-base font-semibold text-ink-950">{benefit.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{benefit.description}</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl bg-mist-100 p-10 sm:p-14">
        <SectionHeading
          eyebrow="A realistic view"
          title="What affects your actual savings"
          description="Every property is different. Actual results depend on factors like:"
        />
        <ul className="mt-6 grid list-disc gap-2 pl-5 text-sm text-ink-800 sm:grid-cols-2">
          <li>Your location and local sun hours</li>
          <li>Roof orientation and shading</li>
          <li>Your electricity tariff structure</li>
          <li>System design and component quality</li>
          <li>Your actual electricity consumption pattern</li>
          <li>Local net-metering or export policies</li>
        </ul>
        <Button asChild variant="solar" size="lg" className="mt-8">
          <Link href="/solar-calculator">
            Get a personalized estimate
            <ArrowRight />
          </Link>
        </Button>
      </div>

      <CtaSection
        title="Ready to Make the Switch to Solar?"
        description="Talk to our team and get a free, no-obligation quote."
        whatsappUrl={whatsappUrl}
      />
    </div>
  );
}
