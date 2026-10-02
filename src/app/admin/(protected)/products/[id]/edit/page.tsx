"use client";

import { use, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { Category, Product } from "@/types";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ProductForm } from "@/components/admin/products/product-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    void Promise.all([
      apiFetch<Category[]>("/categories"),
      apiFetch<Product>(`/products/admin/${id}`),
    ]).then(([cats, prod]) => {
      setCategories(cats);
      setProduct(prod);
    });
  }, [id]);

  return (
    <div>
      <AdminPageHeader title="Edit Product" description="Update product details." />
      {categories && product ? (
        <ProductForm categories={categories} product={product} />
      ) : (
        <Skeleton className="h-96 w-full" />
      )}
    </div>
  );
}
