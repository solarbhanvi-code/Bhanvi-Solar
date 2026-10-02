import { z } from "zod";

export const propertyTypeOptions = [
  { value: "RESIDENTIAL", label: "Residential" },
  { value: "COMMERCIAL", label: "Commercial" },
  { value: "INDUSTRIAL", label: "Industrial" },
  { value: "OTHER", label: "Other" },
] as const;

const optionalNumericString = z
  .string()
  .optional()
  .refine((val) => !val || (!Number.isNaN(Number(val)) && Number(val) >= 0), {
    message: "Enter a valid number",
  });

export const leadFormSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  phone: z
    .string()
    .trim()
    .regex(/^[+()\-\s\d]{7,20}$/, "Please enter a valid phone number"),
  email: z.string().trim().email("Please enter a valid email").optional().or(z.literal("")),
  city: z.string().trim().max(100).optional().or(z.literal("")),
  propertyType: z.enum(["RESIDENTIAL", "COMMERCIAL", "INDUSTRIAL", "OTHER"]).optional(),
  monthlyBill: optionalNumericString,
  interest: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  source: z.string().max(100).optional(),
  /** Honeypot — must stay empty; real users never see or fill this field. */
  website: z.string().max(0, "").optional().or(z.literal("")),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;

export const calculatorFormSchema = z
  .object({
    monthlyBill: optionalNumericString,
    monthlyConsumptionKwh: optionalNumericString,
    location: z.string().trim().max(100).optional().or(z.literal("")),
    propertyType: z.enum(["RESIDENTIAL", "COMMERCIAL", "INDUSTRIAL", "OTHER"]).optional(),
    roofAreaSqft: optionalNumericString,
  })
  .refine((data) => data.monthlyBill || data.monthlyConsumptionKwh, {
    message: "Enter either your monthly bill or your monthly consumption",
    path: ["monthlyBill"],
  });

export type CalculatorFormValues = z.infer<typeof calculatorFormSchema>;

export const loginFormSchema = z.object({
  email: z.string().trim().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
