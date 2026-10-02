import { apiFetch, ApiError } from "./api";
import type {
  Category,
  Faq,
  Paginated,
  Product,
  Project,
  Service,
  Settings,
  Testimonial,
} from "@/types";

const REVALIDATE = 60;

export async function getSettings(): Promise<Settings> {
  return apiFetch<Settings>("/settings", { revalidate: REVALIDATE, tags: ["settings"] });
}

export async function getCategories(): Promise<Category[]> {
  return apiFetch<Category[]>("/categories", { revalidate: REVALIDATE, tags: ["categories"] });
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    return await apiFetch<Category>(`/categories/${slug}`, { revalidate: REVALIDATE });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export interface ProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  featured?: boolean;
  sort?: "newest" | "price-asc" | "price-desc" | "name-asc";
}

function toQueryString(query: object): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function getProducts(query: ProductQuery = {}): Promise<Paginated<Product>> {
  return apiFetch<Paginated<Product>>(`/products${toQueryString(query)}`, {
    revalidate: REVALIDATE,
    tags: ["products"],
  });
}

export async function getProductBySlug(
  slug: string,
): Promise<{ product: Product; related: Product[] } | null> {
  try {
    return await apiFetch(`/products/${slug}`, { revalidate: REVALIDATE, tags: ["products"] });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export interface ProjectQuery {
  page?: number;
  limit?: number;
  projectType?: "RESIDENTIAL" | "COMMERCIAL" | "INDUSTRIAL";
  featured?: boolean;
}

export async function getProjects(query: ProjectQuery = {}): Promise<Paginated<Project>> {
  return apiFetch<Paginated<Project>>(`/projects${toQueryString(query)}`, {
    revalidate: REVALIDATE,
    tags: ["projects"],
  });
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    return await apiFetch<Project>(`/projects/${slug}`, {
      revalidate: REVALIDATE,
      tags: ["projects"],
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function getServices(): Promise<Service[]> {
  return apiFetch<Service[]>("/services", { revalidate: REVALIDATE, tags: ["services"] });
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  try {
    return await apiFetch<Service>(`/services/${slug}`, {
      revalidate: REVALIDATE,
      tags: ["services"],
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return apiFetch<Testimonial[]>("/testimonials", {
    revalidate: REVALIDATE,
    tags: ["testimonials"],
  });
}

export async function getFaqs(): Promise<Faq[]> {
  return apiFetch<Faq[]>("/faqs", { revalidate: REVALIDATE, tags: ["faqs"] });
}
