import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { getProductBySlug, getSettings } from "@/lib/data";
import { buildMetadata, siteUrl } from "@/lib/seo";
import { formatCurrency } from "@/lib/utils";
import { buildWhatsAppUrl, productEnquiryMessage } from "@/lib/whatsapp";
import { Badge } from "@/components/ui/badge";
import { ImageGallery } from "@/components/shared/image-gallery";
import { ProductCard } from "@/components/shared/product-card";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { QuoteForm } from "@/components/shared/quote-form";
import { SectionHeading } from "@/components/shared/section-heading";

interface PageParams {
  params: Promise<{ slug: string }>;
}

const AVAILABILITY_LABEL: Record<string, string> = {
  IN_STOCK: "In Stock",
  OUT_OF_STOCK: "Out of Stock",
  PRE_ORDER: "Pre-Order",
};

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProductBySlug(slug);
  if (!data) return {};
  const { product } = data;
  return buildMetadata({
    title: product.seo?.title ?? `${product.name} | Bhanvi Solar`,
    description: product.seo?.description ?? product.shortDescription ?? product.description,
    path: `/products/${product.slug}`,
    seo: product.seo,
    image: product.images[0]?.url,
  });
}

export default async function ProductDetailPage({ params }: PageParams) {
  const { slug } = await params;
  const [data, settings] = await Promise.all([getProductBySlug(slug), getSettings()]);
  if (!data) notFound();
  const { product, related } = data;
  const category = typeof product.category === "string" ? undefined : product.category;
  const whatsappUrl = buildWhatsAppUrl(settings.whatsapp, productEnquiryMessage(product.name));

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription ?? product.description,
    brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
    image: product.images.map((img) => img.url),
    ...(product.price
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "INR",
            price: product.price,
            availability:
              product.availability === "IN_STOCK"
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            url: siteUrl(`/products/${product.slug}`),
          },
        }
      : {}),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Products", item: siteUrl("/products") },
      { "@type": "ListItem", position: 2, name: product.name, item: siteUrl(`/products/${product.slug}`) },
    ],
  };

  return (
    <div className="container-page flex flex-col gap-16 py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="grid gap-12 lg:grid-cols-2">
        <ImageGallery
          images={product.images.map((img) => ({ url: img.url, alt: img.alt }))}
          name={product.name}
        />

        <div className="flex flex-col gap-5">
          {category && (
            <span className="text-sm font-semibold uppercase tracking-wide text-energy-600">
              {category.name}
            </span>
          )}
          <h1 className="font-display text-3xl font-bold text-ink-950 sm:text-4xl">{product.name}</h1>
          {product.brand && <p className="text-sm text-muted-foreground">by {product.brand}</p>}

          <div className="flex items-center gap-3">
            <span className="font-display text-2xl font-semibold text-ink-950">
              {product.price ? formatCurrency(product.price) : "Request Quote"}
            </span>
            <Badge variant={product.availability === "IN_STOCK" ? "energy" : "muted"}>
              {AVAILABILITY_LABEL[product.availability]}
            </Badge>
            {product.featured && <Badge variant="solar">Featured</Badge>}
          </div>

          {product.shortDescription && (
            <p className="text-base leading-relaxed text-muted-foreground">{product.shortDescription}</p>
          )}

          {product.features.length > 0 && (
            <ul className="grid gap-2 sm:grid-cols-2">
              {product.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-ink-800">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-energy-500" />
                  {feature}
                </li>
              ))}
            </ul>
          )}

          {product.warranty && (
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-ink-950">Warranty:</span> {product.warranty}
            </p>
          )}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <WhatsAppButton url={whatsappUrl} label="Enquire on WhatsApp" className="h-12" />
          </div>
        </div>
      </div>

      <div className="grid gap-12 lg:grid-cols-3">
        <div className="flex flex-col gap-10 lg:col-span-2">
          <div>
            <h2 className="font-display text-lg font-semibold text-ink-950">Description</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          </div>

          {product.specifications.length > 0 && (
            <div>
              <h2 className="font-display text-lg font-semibold text-ink-950">Specifications</h2>
              <div className="mt-3 overflow-hidden rounded-xl border border-border">
                <table className="w-full text-sm">
                  <tbody>
                    {product.specifications.map((spec, idx) => (
                      <tr key={spec.key} className={idx % 2 === 0 ? "bg-white" : "bg-mist-50"}>
                        <td className="w-1/3 px-4 py-3 font-medium text-ink-950">{spec.key}</td>
                        <td className="px-4 py-3 text-muted-foreground">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {product.applications.length > 0 && (
            <div>
              <h2 className="font-display text-lg font-semibold text-ink-950">Applications</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.applications.map((app) => (
                  <Badge key={app} variant="outline">
                    {app}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm lg:sticky lg:top-24 lg:h-fit">
          <h2 className="font-display text-lg font-semibold text-ink-950">Request a quote</h2>
          <p className="mt-1 text-sm text-muted-foreground">We&apos;ll get back to you with pricing and availability.</p>
          <QuoteForm className="mt-6" defaultInterest={product.name} source={`product:${product.slug}`} />
        </div>
      </div>

      {related.length > 0 && (
        <section>
          <SectionHeading eyebrow="You may also like" title="Related Products" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
