import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { getSettings } from "@/lib/data";
import { buildMetadata, siteUrl } from "@/lib/seo";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const sora = Sora({ variable: "--font-sora", subsets: ["latin"], display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    ...buildMetadata({
      title: settings.defaultSEO?.title ?? settings.companyName,
      description: settings.defaultSEO?.description ?? settings.tagline,
      path: "/",
      seo: settings.defaultSEO,
    }),
    metadataBase: new URL(siteUrl()),
    icons: { icon: "/favicon.ico" },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: settings.companyName,
    description: settings.aboutText ?? settings.tagline,
    url: siteUrl(),
    ...(settings.logo ? { logo: settings.logo } : {}),
    ...(settings.phone ? { telephone: settings.phone } : {}),
    ...(settings.email ? { email: settings.email } : {}),
    ...(settings.address ? { address: settings.address } : {}),
  };

  return (
    <html lang="en" className={`${inter.variable} ${sora.variable} antialiased`}>
      <body className="flex min-h-screen flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
