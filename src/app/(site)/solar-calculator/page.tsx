import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { SectionHeading } from "@/components/shared/section-heading";
import { CalculatorWidget } from "@/components/calculator/calculator-widget";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Solar Calculator | Bhanvi Solar",
    description: "Estimate your recommended solar system size, generation and savings.",
    path: "/solar-calculator",
  });
}

export default function SolarCalculatorPage() {
  return (
    <div className="container-page flex flex-col gap-10 py-20">
      <SectionHeading
        eyebrow="Solar Calculator"
        title="Estimate your solar savings"
        description="This is an estimation tool. Actual results depend on your location, roof orientation, shading, electricity tariff, system design and other factors."
      />
      <CalculatorWidget />
    </div>
  );
}
