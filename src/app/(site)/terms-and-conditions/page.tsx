import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Terms & Conditions | Bhanvi Solar",
    description: "Terms and conditions for using the Bhanvi Solar website.",
    path: "/terms-and-conditions",
    noIndex: true,
  });
}

export default function TermsPage() {
  return (
    <div className="container-page flex flex-col gap-6 py-20">
      <h1 className="font-display text-3xl font-bold text-ink-950">Terms &amp; Conditions</h1>
      <div className="rounded-2xl border border-solar-500/30 bg-solar-500/5 p-4 text-sm text-ink-800">
        This is placeholder legal content generated for development purposes. It must be reviewed
        by a qualified professional and updated with accurate, jurisdiction-specific information
        before this site goes live.
      </div>

      <div className="prose prose-sm max-w-none text-ink-800">
        <h2 className="font-display mt-4 text-xl font-semibold text-ink-950">Use of This Website</h2>
        <p>
          This website is provided by {"{Company Name}"} for informational purposes about our solar
          products and services. Product pricing, availability and specifications are subject to
          change and should be confirmed at the time of quotation.
        </p>
        <h2 className="font-display mt-8 text-xl font-semibold text-ink-950">Estimates &amp; Calculators</h2>
        <p>
          Figures shown by the solar calculator on this website are estimates only, based on
          general assumptions. They do not constitute a guarantee of system performance, savings
          or payback period. A formal quotation and site assessment are required for accurate
          figures.
        </p>
        <h2 className="font-display mt-8 text-xl font-semibold text-ink-950">Enquiries &amp; Quotes</h2>
        <p>
          Submitting an enquiry or quote request through this website does not constitute a binding
          contract. A formal agreement will be provided separately before any work begins.
        </p>
        <h2 className="font-display mt-8 text-xl font-semibold text-ink-950">Limitation of Liability</h2>
        <p>
          To the extent permitted by law, {"{Company Name}"} is not liable for any indirect or
          consequential loss arising from use of this website or reliance on estimates shown on it.
        </p>
        <h2 className="font-display mt-8 text-xl font-semibold text-ink-950">Contact</h2>
        <p>
          Questions about these terms can be directed to us via our <a href="/contact">Contact page</a>.
        </p>
      </div>
    </div>
  );
}
