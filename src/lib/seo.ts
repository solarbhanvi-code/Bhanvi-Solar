import type { Metadata } from "next";
import type { Seo } from "@/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const DEFAULT_TITLE = "Bhanvi Solar";
const DEFAULT_DESCRIPTION =
  "Bhanvi Solar provides solar panels, batteries, inverters and professional solar installation services for homes and businesses.";

interface BuildMetadataOptions {
  title?: string;
  description?: string;
  path: string;
  seo?: Seo;
  image?: string;
  noIndex?: boolean;
}

export function buildMetadata({
  title,
  description,
  path,
  seo,
  image,
  noIndex,
}: BuildMetadataOptions): Metadata {
  const resolvedTitle = seo?.title ?? title ?? DEFAULT_TITLE;
  const resolvedDescription = seo?.description ?? description ?? DEFAULT_DESCRIPTION;
  const url = `${SITE_URL}${path}`;
  const ogImage = seo?.ogImage ?? image;

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    keywords: seo?.keywords,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      url,
      siteName: DEFAULT_TITLE,
      type: "website",
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export function siteUrl(path = ""): string {
  return `${SITE_URL}${path}`;
}
