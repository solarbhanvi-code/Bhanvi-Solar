"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "RESIDENTIAL", label: "Residential" },
  { value: "COMMERCIAL", label: "Commercial" },
  { value: "INDUSTRIAL", label: "Industrial" },
];

export function ProjectFilterTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get("type") ?? "all";

  return (
    <Tabs
      value={active}
      onValueChange={(value) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === "all") params.delete("type");
        else params.set("type", value);
        params.delete("page");
        const qs = params.toString();
        router.push(qs ? `${pathname}?${qs}` : pathname);
      }}
    >
      <TabsList>
        {FILTERS.map((filter) => (
          <TabsTrigger key={filter.value} value={filter.value}>
            {filter.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
