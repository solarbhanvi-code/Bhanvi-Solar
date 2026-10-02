"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { apiFetch, ApiError } from "@/lib/api";
import type { Category, ImageAsset, Product, Specification } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUploader } from "@/components/admin/image-uploader";

const productSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(150),
  shortDescription: z.string().trim().max(200).optional().or(z.literal("")),
  description: z.string().trim().min(10, "Description is required"),
  price: z.string().optional(),
  brand: z.string().trim().max(100).optional().or(z.literal("")),
  warranty: z.string().trim().max(200).optional().or(z.literal("")),
  availability: z.enum(["IN_STOCK", "OUT_OF_STOCK", "PRE_ORDER"]),
  featured: z.boolean(),
  isActive: z.boolean(),
  seoTitle: z.string().trim().max(70).optional().or(z.literal("")),
  seoDescription: z.string().trim().max(160).optional().or(z.literal("")),
});
type ProductFormValues = z.infer<typeof productSchema>;

function StringListField({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      {values.map((value, index) => (
        <div key={index} className="flex gap-2">
          <Input
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(values.map((v, i) => (i === index ? e.target.value : v)))}
          />
          <Button type="button" variant="outline" size="icon" onClick={() => onChange(values.filter((_, i) => i !== index))}>
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" className="w-fit" onClick={() => onChange([...values, ""])}>
        <Plus className="size-3.5" /> Add {label.toLowerCase().replace(/s$/, "")}
      </Button>
    </div>
  );
}

interface ProductFormProps {
  categories: Category[];
  product?: Product;
}

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const [images, setImages] = useState<ImageAsset[]>(product?.images ?? []);
  const [specifications, setSpecifications] = useState<Specification[]>(product?.specifications ?? []);
  const [features, setFeatures] = useState<string[]>(product?.features ?? []);
  const [applications, setApplications] = useState<string[]>(product?.applications ?? []);
  const [categoryId, setCategoryId] = useState(
    typeof product?.category === "string" ? product.category : (product?.category?._id ?? ""),
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? "",
      shortDescription: product?.shortDescription ?? "",
      description: product?.description ?? "",
      price: product?.price !== undefined ? String(product.price) : "",
      brand: product?.brand ?? "",
      warranty: product?.warranty ?? "",
      availability: product?.availability ?? "IN_STOCK",
      featured: product?.featured ?? false,
      isActive: product?.isActive ?? true,
      seoTitle: product?.seo?.title ?? "",
      seoDescription: product?.seo?.description ?? "",
    },
  });

  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [isActive, setIsActive] = useState(product?.isActive ?? true);
  const [availability, setAvailability] = useState(product?.availability ?? "IN_STOCK");

  async function onSubmit(values: ProductFormValues) {
    const payload = {
      name: values.name,
      shortDescription: values.shortDescription || undefined,
      description: values.description,
      price: values.price ? Number(values.price) : undefined,
      category: categoryId,
      brand: values.brand || undefined,
      warranty: values.warranty || undefined,
      availability,
      featured,
      isActive,
      images,
      specifications: specifications.filter((s) => s.key && s.value),
      features: features.filter(Boolean),
      applications: applications.filter(Boolean),
      seo: {
        title: values.seoTitle || undefined,
        description: values.seoDescription || undefined,
      },
    };

    try {
      if (product) {
        await apiFetch(`/products/${product._id}`, { method: "PATCH", body: JSON.stringify(payload) });
        toast.success("Product updated");
      } else {
        await apiFetch("/products", { method: "POST", body: JSON.stringify(payload) });
        toast.success("Product created");
      }
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Something went wrong");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8" noValidate>
      <section className="rounded-2xl border border-border bg-white p-6">
        <h2 className="font-display text-base font-semibold text-ink-950">Basic Information</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input id="name" {...register("name")} aria-invalid={!!errors.name} />
            {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="category">Category *</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!categoryId && <p className="text-xs text-muted-foreground">Required</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="brand">Brand / Manufacturer</Label>
            <Input id="brand" {...register("brand")} />
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="shortDescription">Short Description</Label>
            <Input id="shortDescription" {...register("shortDescription")} placeholder="Shown on product cards" />
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" rows={5} {...register("description")} aria-invalid={!!errors.description} />
            {errors.description && <p className="text-xs text-red-600">{errors.description.message}</p>}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-white p-6">
        <h2 className="font-display text-base font-semibold text-ink-950">Images</h2>
        <div className="mt-5">
          <ImageUploader images={images} onChange={setImages} />
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-white p-6">
        <h2 className="font-display text-base font-semibold text-ink-950">Pricing & Availability</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="price">Price (leave blank for &quot;Request Quote&quot;)</Label>
            <Input id="price" type="number" min={0} {...register("price")} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="availability">Availability</Label>
            <Select value={availability} onValueChange={(v) => setAvailability(v as typeof availability)}>
              <SelectTrigger id="availability">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IN_STOCK">In Stock</SelectItem>
                <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                <SelectItem value="PRE_ORDER">Pre-Order</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="warranty">Warranty</Label>
            <Input id="warranty" {...register("warranty")} />
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-8">
          <div className="flex items-center gap-3">
            <Switch checked={featured} onCheckedChange={setFeatured} id="featured" />
            <Label htmlFor="featured">Featured on homepage</Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={isActive} onCheckedChange={setIsActive} id="isActive" />
            <Label htmlFor="isActive">Published (visible on site)</Label>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-white p-6">
        <h2 className="font-display text-base font-semibold text-ink-950">Specifications</h2>
        <div className="mt-5 flex flex-col gap-2">
          {specifications.map((spec, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={spec.key}
                placeholder="Key (e.g. Power)"
                onChange={(e) =>
                  setSpecifications(specifications.map((s, i) => (i === index ? { ...s, key: e.target.value } : s)))
                }
              />
              <Input
                value={spec.value}
                placeholder="Value (e.g. 550W)"
                onChange={(e) =>
                  setSpecifications(specifications.map((s, i) => (i === index ? { ...s, value: e.target.value } : s)))
                }
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setSpecifications(specifications.filter((_, i) => i !== index))}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit"
            onClick={() => setSpecifications([...specifications, { key: "", value: "" }])}
          >
            <Plus className="size-3.5" /> Add specification
          </Button>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-white p-6">
        <div className="grid gap-8 sm:grid-cols-2">
          <StringListField label="Features" values={features} onChange={setFeatures} placeholder="e.g. High efficiency" />
          <StringListField label="Applications" values={applications} onChange={setApplications} placeholder="e.g. Residential rooftop" />
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-white p-6">
        <h2 className="font-display text-base font-semibold text-ink-950">SEO Metadata</h2>
        <div className="mt-5 grid gap-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="seoTitle">SEO Title</Label>
            <Input id="seoTitle" {...register("seoTitle")} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="seoDescription">SEO Description</Label>
            <Textarea id="seoDescription" rows={2} {...register("seoDescription")} />
          </div>
        </div>
      </section>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
          Cancel
        </Button>
        <Button type="submit" variant="solar" disabled={isSubmitting || !categoryId}>
          {isSubmitting && <Loader2 className="animate-spin" />}
          {product ? "Save changes" : "Create product"}
        </Button>
      </div>
    </form>
  );
}
