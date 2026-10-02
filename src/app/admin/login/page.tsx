"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sun } from "lucide-react";
import { loginFormSchema, type LoginFormValues } from "@/lib/validation";
import { apiFetch, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginFormSchema) });

  async function onSubmit(values: LoginFormValues) {
    setServerError(null);
    try {
      await apiFetch("/auth/login", { method: "POST", body: JSON.stringify(values) });
      router.replace("/admin");
    } catch (error) {
      setServerError(error instanceof ApiError ? error.message : "Login failed. Please try again.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-ink-700 bg-ink-900 p-8 shadow-xl">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-white/10 text-solar-400">
            <Sun className="size-6" />
          </span>
          <h1 className="font-display text-xl font-semibold text-white">Admin Login</h1>
          <p className="text-sm text-white/50">Sign in to manage your Bhanvi Solar website</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email" className="text-white/80">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="username"
              className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
              {...register("email")}
              aria-invalid={!!errors.email}
            />
            {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password" className="text-white/80">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
              {...register("password")}
              aria-invalid={!!errors.password}
            />
            {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
          </div>

          {serverError && <p className="text-sm text-red-400">{serverError}</p>}

          <Button type="submit" variant="solar" size="lg" className="mt-2" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="animate-spin" />}
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
