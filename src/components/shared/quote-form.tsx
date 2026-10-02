"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2 } from "lucide-react";
import { leadFormSchema, propertyTypeOptions, type LeadFormValues } from "@/lib/validation";
import { apiFetch, ApiError } from "@/lib/api";
import { trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface QuoteFormProps {
  defaultInterest?: string;
  source?: string;
  className?: string;
}

export function QuoteForm({ defaultInterest, source, className }: QuoteFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const startedTracked = useRef(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: { interest: defaultInterest ?? "", website: "" },
  });

  const propertyType = watch("propertyType");

  function handleFocusStart() {
    if (!startedTracked.current) {
      trackEvent("quote_form_started");
      startedTracked.current = true;
    }
  }

  async function onSubmit(values: LeadFormValues) {
    setServerError(null);
    try {
      await apiFetch("/leads", {
        method: "POST",
        body: JSON.stringify({
          ...values,
          email: values.email || undefined,
          city: values.city || undefined,
          interest: values.interest || undefined,
          message: values.message || undefined,
          monthlyBill: values.monthlyBill === "" ? undefined : values.monthlyBill,
          source: source ?? "website",
        }),
      });
      trackEvent("quote_submitted", { source });
      setSubmitted(true);
    } catch (error) {
      setServerError(
        error instanceof ApiError ? error.message : "Something went wrong. Please try again.",
      );
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-energy-500/30 bg-energy-500/5 p-8 text-center">
        <CheckCircle2 className="size-10 text-energy-500" />
        <h3 className="font-display text-lg font-semibold text-ink-950">Thank you!</h3>
        <p className="text-sm text-muted-foreground">
          We&apos;ve received your enquiry and will get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} onFocus={handleFocusStart} className={className} noValidate>
      {/* Honeypot — hidden from real users, left visible to bots that auto-fill forms. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Name *</Label>
          <Input id="name" placeholder="Your full name" {...register("name")} aria-invalid={!!errors.name} />
          {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">Phone *</Label>
          <Input id="phone" placeholder="+91 98765 43210" {...register("phone")} aria-invalid={!!errors.phone} />
          {errors.phone && <p className="text-xs text-red-600">{errors.phone.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" {...register("email")} aria-invalid={!!errors.email} />
          {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="city">City</Label>
          <Input id="city" placeholder="Your city" {...register("city")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="propertyType">Property Type</Label>
          <Select
            value={propertyType}
            onValueChange={(value) => setValue("propertyType", value as LeadFormValues["propertyType"])}
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
          <Label htmlFor="monthlyBill">Monthly Electricity Bill</Label>
          <Input id="monthlyBill" type="number" min={0} placeholder="e.g. 4000" {...register("monthlyBill")} />
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="interest">Interested Service / Product</Label>
          <Input id="interest" placeholder="e.g. Residential Solar, 550W Panel" {...register("interest")} />
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" rows={4} placeholder="Tell us a bit about your requirement" {...register("message")} />
        </div>
      </div>

      {serverError && <p className="mt-4 text-sm text-red-600">{serverError}</p>}

      <Button type="submit" variant="solar" size="lg" className="mt-6 w-full sm:w-auto" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="animate-spin" />}
        Get a Free Quote
      </Button>
    </form>
  );
}
