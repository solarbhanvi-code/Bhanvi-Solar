"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { Category } from "@/types";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ProductForm } from "@/components/admin/products/product-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewProductPage() {
  const [categories, setCategories] = useState<Category[] | null>(null);

  useEffect(() => {
    void apiFetch<Category[]>("/categories").then(setCategories);
  }, []);

  return (
    <div>
      <AdminPageHeader title="New Product" description="Add a new product to your catalogue." />
      {categories ? <ProductForm categories={categories} /> : <Skeleton className="h-96 w-full" />}
    </div>
  );
}
