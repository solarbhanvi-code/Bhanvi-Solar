import type { Metadata } from "next";
import { getCategories, getProducts } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProductCard } from "@/components/shared/product-card";
import { ProductFilters } from "@/components/products/product-filters";
import { Pagination } from "@/components/ui/pagination";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Solar Products | Bhanvi Solar",
    description: "Browse solar panels, batteries, inverters, solar lights and accessories.",
    path: "/products",
  });
}

interface PageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    sort?: "newest" | "price-asc" | "price-desc" | "name-asc";
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page ?? "1") || 1;

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({
      search: params.search,
      category: params.category,
      sort: params.sort,
      page,
      limit: 12,
    }),
  ]);

  function buildHref(targetPage: number) {
    const sp = new URLSearchParams();
    if (params.search) sp.set("search", params.search);
    if (params.category) sp.set("category", params.category);
    if (params.sort) sp.set("sort", params.sort);
    if (targetPage > 1) sp.set("page", String(targetPage));
    const qs = sp.toString();
    return qs ? `/products?${qs}` : "/products";
  }

  return (
    <div className="container-page flex flex-col gap-10 py-20">
      <SectionHeading
        eyebrow="Catalogue"
        title="Solar Products"
        description="Solar panels, batteries, inverters, solar lights and accessories for homes and businesses."
      />

      <ProductFilters categories={categories} />

      {products.items.length > 0 ? (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.items.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          <Pagination page={products.page} totalPages={products.totalPages} buildHref={buildHref} />
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-mist-50 p-16 text-center">
          <p className="text-sm text-muted-foreground">
            {params.search || params.category
              ? "No products match your filters. Try adjusting your search."
              : "No products available yet. Check back soon."}
          </p>
        </div>
      )}
    </div>
  );
}
