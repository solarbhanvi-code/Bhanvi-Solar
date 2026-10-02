import type { Metadata } from "next";
import { getFaqs } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { SectionHeading } from "@/components/shared/section-heading";
import { FaqAccordion } from "@/components/shared/faq-accordion";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Frequently Asked Questions | Bhanvi Solar",
    description: "Answers to common questions about solar installation, maintenance and system sizing.",
    path: "/faq",
  });
}

export default async function FaqPage() {
  const faqs = await getFaqs();

  const faqJsonLd =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }
      : null;

  return (
    <div className="container-page flex flex-col gap-10 py-20">
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}

      <SectionHeading
        eyebrow="FAQ"
        title="Frequently Asked Questions"
        description="Answers to common questions about going solar."
        align="center"
        className="mx-auto items-center text-center"
      />

      <div className="mx-auto w-full max-w-3xl rounded-2xl border border-border bg-white px-6">
        <FaqAccordion faqs={faqs} />
      </div>
    </div>
  );
}
