"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { apiFetch, ApiError } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import type { Category, Paginated, Product } from "@/types";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminProductsPage() {
  const [data, setData] = useState<Paginated<Product> | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);

  async function load() {
    setLoading(true);
    const qs = new URLSearchParams({ page: String(page), limit: "10" });
    if (search) qs.set("search", search);
    if (category !== "all") qs.set("category", category);
    const [products, cats] = await Promise.all([
      apiFetch<Paginated<Product>>(`/products/admin/all?${qs.toString()}`),
      categories.length ? Promise.resolve(categories) : apiFetch<Category[]>("/categories"),
    ]);
    setData(products);
    setCategories(cats);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount/filter-change
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, category]);

  async function handleDelete(id: string) {
    try {
      await apiFetch(`/products/${id}`, { method: "DELETE" });
      toast.success("Product deleted");
      await load();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Could not delete product");
      throw error;
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Products"
        description="Manage your product catalogue."
        action={
          <Button asChild variant="solar">
            <Link href="/admin/products/new">
              <Plus /> New Product
            </Link>
          </Button>
        }
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <form
          className="relative flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            void load();
          }}
        >
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="pl-10" />
        </form>
        <Select
          value={category}
          onValueChange={(v) => {
            setCategory(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="sm:w-56">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c._id} value={c._id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-2xl border border-border bg-white">
        {loading || !data ? (
          <div className="p-6">
            <Skeleton className="h-64 w-full" />
          </div>
        ) : data.items.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">No products found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((product) => {
                const cat = typeof product.category === "string" ? undefined : product.category;
                return (
                  <TableRow key={product._id}>
                    <TableCell className="font-medium text-ink-950">
                      <div className="flex items-center gap-2">
                        {product.name}
                        {product.featured && <Badge variant="solar">Featured</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{cat?.name ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {product.price ? formatCurrency(product.price) : "Quote"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.isActive ? "energy" : "muted"}>
                        {product.isActive ? "Published" : "Hidden"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/products/${product._id}/edit`}>
                            <Pencil className="size-3.5" />
                          </Link>
                        </Button>
                        <ConfirmDialog
                          trigger={
                            <Button variant="destructive" size="sm">
                              <Trash2 className="size-3.5" />
                            </Button>
                          }
                          title={`Delete "${product.name}"?`}
                          description="This action cannot be undone."
                          onConfirm={() => handleDelete(product._id)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {data && data.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4 text-sm">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            Previous
          </Button>
          <span className="text-muted-foreground">
            Page {data.page} of {data.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= data.totalPages}
            onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
