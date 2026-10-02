import type { MetadataRoute } from "next";
import { getProducts, getProjects, getServices } from "@/lib/data";
import { siteUrl } from "@/lib/seo";

const STATIC_ROUTES = [
  "",
  "/about",
  "/services",
  "/products",
  "/projects",
  "/why-solar",
  "/solar-calculator",
  "/faq",
  "/contact",
  "/privacy-policy",
  "/terms-and-conditions",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, projects, services] = await Promise.all([
    getProducts({ limit: 100 }).catch(() => ({ items: [] })),
    getProjects({ limit: 100 }).catch(() => ({ items: [] })),
    getServices().catch(() => []),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: siteUrl(path),
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  const productEntries: MetadataRoute.Sitemap = products.items.map((product) => ({
    url: siteUrl(`/products/${product.slug}`),
    lastModified: new Date(product.updatedAt),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const projectEntries: MetadataRoute.Sitemap = projects.items.map((project) => ({
    url: siteUrl(`/projects/${project.slug}`),
    lastModified: new Date(project.updatedAt),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const serviceEntries: MetadataRoute.Sitemap = services.map((service) => ({
    url: siteUrl(`/services/${service.slug}`),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...productEntries, ...projectEntries, ...serviceEntries];
}
