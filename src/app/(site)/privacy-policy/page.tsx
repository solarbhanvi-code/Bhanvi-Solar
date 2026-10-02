import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Privacy Policy | Bhanvi Solar",
    description: "Privacy policy for the Bhanvi Solar website.",
    path: "/privacy-policy",
    noIndex: true,
  });
}

export default function PrivacyPolicyPage() {
  return (
    <div className="container-page flex flex-col gap-6 py-20">
      <h1 className="font-display text-3xl font-bold text-ink-950">Privacy Policy</h1>
      <div className="rounded-2xl border border-solar-500/30 bg-solar-500/5 p-4 text-sm text-ink-800">
        This is placeholder legal content generated for development purposes. It must be reviewed
        by a qualified professional and updated with accurate, jurisdiction-specific information
        before this site goes live.
      </div>

      <div className="prose prose-sm max-w-none text-ink-800">
        <p>
          This Privacy Policy explains how {"{Company Name}"} (&quot;we&quot;, &quot;us&quot;) collects,
          uses and protects information you provide when you use this website, including when you
          submit an enquiry, use the solar calculator, or contact us via WhatsApp.
        </p>
        <h2 className="font-display mt-8 text-xl font-semibold text-ink-950">Information We Collect</h2>
        <p>
          When you submit a quote or contact form, we collect the information you provide, such as
          your name, phone number, email address, city, property type and message. We do not
          knowingly collect more information than is necessary to respond to your enquiry.
        </p>
        <h2 className="font-display mt-8 text-xl font-semibold text-ink-950">How We Use Information</h2>
        <p>
          We use the information you provide to respond to your enquiry, prepare quotations, and
          provide information about our products and services. We do not sell your information to
          third parties.
        </p>
        <h2 className="font-display mt-8 text-xl font-semibold text-ink-950">Data Retention</h2>
        <p>We retain enquiry information for as long as reasonably necessary to respond to and follow up on your request.</p>
        <h2 className="font-display mt-8 text-xl font-semibold text-ink-950">Contact</h2>
        <p>
          If you have questions about this policy, please contact us using the details on our{" "}
          <a href="/contact">Contact page</a>.
        </p>
      </div>
    </div>
  );
}
