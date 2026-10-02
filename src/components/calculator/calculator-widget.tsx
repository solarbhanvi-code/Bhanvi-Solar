"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2, Sun, Zap, Wallet, Clock, Leaf } from "lucide-react";
import { calculatorFormSchema, propertyTypeOptions, type CalculatorFormValues } from "@/lib/validation";
import { apiFetch, ApiError } from "@/lib/api";
import { trackEvent } from "@/lib/analytics";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { CalculatorResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function CalculatorWidget() {
  const [result, setResult] = useState<CalculatorResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CalculatorFormValues>({ resolver: zodResolver(calculatorFormSchema) });

  const propertyType = watch("propertyType");

  async function onSubmit(values: CalculatorFormValues) {
    setError(null);
    try {
      const response = await apiFetch<CalculatorResponse>("/calculator/estimate", {
        method: "POST",
        body: JSON.stringify({
          monthlyBill: values.monthlyBill || undefined,
          monthlyConsumptionKwh: values.monthlyConsumptionKwh || undefined,
          roofAreaSqft: values.roofAreaSqft || undefined,
          propertyType: values.propertyType || undefined,
          location: values.location || undefined,
        }),
      });
      setResult(response);
      trackEvent("calculator_used");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not calculate an estimate. Please try again.");
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8" noValidate>
        <div className="grid gap-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="monthlyBill">Monthly Electricity Bill</Label>
            <Input id="monthlyBill" type="number" min={0} placeholder="e.g. 4000" {...register("monthlyBill")} />
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> OR <span className="h-px flex-1 bg-border" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="monthlyConsumptionKwh">Monthly Consumption (kWh)</Label>
            <Input
              id="monthlyConsumptionKwh"
              type="number"
              min={0}
              placeholder="e.g. 500"
              {...register("monthlyConsumptionKwh")}
            />
          </div>
          {errors.monthlyBill && <p className="text-xs text-red-600">{errors.monthlyBill.message}</p>}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="location">Location</Label>
            <Input id="location" placeholder="City / Area" {...register("location")} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="propertyType">Property Type</Label>
            <Select
              value={propertyType}
              onValueChange={(value) => setValue("propertyType", value as CalculatorFormValues["propertyType"])}
            >
              <SelectTrigger id="propertyType">
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                {propertyTypeOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="roofAreaSqft">Available Roof Area (sq. ft.)</Label>
            <Input id="roofAreaSqft" type="number" min={0} placeholder="e.g. 400" {...register("roofAreaSqft")} />
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <Button type="submit" variant="solar" size="lg" className="mt-6 w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="animate-spin" />}
          Calculate My Solar Savings
        </Button>
      </form>

      <div className="rounded-2xl bg-ink-950 p-6 shadow-sm sm:p-8">
        {!result ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 py-12 text-center">
            <Sun className="size-10 text-solar-400" />
            <p className="max-w-xs text-sm text-white/60">
              Fill in the form to see your estimated system size, generation and savings.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
              <ResultTile
                icon={Zap}
                label="Recommended System"
                value={`${result.result.recommendedSystemSizeKw} kW`}
              />
              <ResultTile
                icon={Sun}
                label="Annual Generation"
                value={`${formatNumber(result.result.estimatedAnnualGenerationKwh)} kWh`}
              />
              <ResultTile icon={Wallet} label="Annual Savings" value={formatCurrency(result.result.estimatedAnnualSavings)} />
              <ResultTile
                icon={Clock}
                label="Payback Period"
                value={result.result.paybackYears ? `${result.result.paybackYears} yrs` : "N/A"}
              />
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-white/5 p-4 text-sm text-white/70">
              <Leaf className="size-4 shrink-0 text-energy-400" />
              Estimated CO₂ offset: {formatNumber(result.result.co2OffsetKgPerYear)} kg/year
            </div>

            {result.result.roofConstrained && (
              <p className="text-xs text-solar-300">
                Note: system size was limited by your available roof area.
              </p>
            )}

            <p className="text-xs leading-relaxed text-white/50">{result.disclaimer}</p>

            <Button asChild variant="solar" size="lg" onClick={() => trackEvent("calculator_quote_clicked")}>
              <Link href="/contact">
                Get a Detailed Quote
                <ArrowRight />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function ResultTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Sun;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-white/5 p-4">
      <Icon className="size-4 text-solar-400" />
      <p className="mt-2 font-display text-lg font-semibold text-white">{value}</p>
      <p className="text-xs text-white/50">{label}</p>
    </div>
  );
}
