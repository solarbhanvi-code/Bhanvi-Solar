"use client";

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { apiFetch, ApiError } from "@/lib/api";
import type { Settings } from "@/types";
import { AdminPageHeader } from "@/components/admin/page-header";
import { SingleImageField } from "@/components/admin/settings/single-image-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string | number | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      <Input type={type} value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void apiFetch<Settings>("/settings").then(setSettings);
  }, []);

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  function updateNested<K extends keyof Settings>(key: K, patch: Partial<Settings[K]>) {
    setSettings((prev) => (prev ? { ...prev, [key]: { ...(prev[key] as object), ...patch } } : prev));
  }

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    try {
      // The backend rejects unknown properties (forbidNonWhitelisted), so
      // strip Mongoose document fields (_id, createdAt, updatedAt, __v)
      // that came along with the GET /settings response.
      type SettingsDocument = Settings & { createdAt?: string; updatedAt?: string; __v?: number };
      const documentFields: SettingsDocument = settings;
      const payload: Settings = { ...documentFields };
      delete (payload as Partial<SettingsDocument>)._id;
      delete (payload as Partial<SettingsDocument>).createdAt;
      delete (payload as Partial<SettingsDocument>).updatedAt;
      delete (payload as Partial<SettingsDocument>).__v;

      const updated = await apiFetch<Settings>("/settings", {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      setSettings(updated);
      toast.success("Settings saved");
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Could not save settings");
    } finally {
      setSaving(false);
    }
  }

  if (!settings) {
    return (
      <div>
        <AdminPageHeader title="Settings" description="Manage site-wide company and CMS settings." />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Settings"
        description="Manage site-wide company and CMS settings."
        action={
          <Button variant="solar" onClick={() => void handleSave()} disabled={saving}>
            {saving ? <Loader2 className="animate-spin" /> : <Save />}
            Save Changes
          </Button>
        }
      />

      <Tabs defaultValue="general">
        <TabsList className="flex-wrap">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="hero">Hero &amp; About</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="grid gap-5 rounded-2xl border border-border bg-white p-6 sm:grid-cols-2">
            <Field label="Company Name" value={settings.companyName} onChange={(v) => update("companyName", v)} />
            <Field label="Tagline" value={settings.tagline} onChange={(v) => update("tagline", v)} />
            <div className="sm:col-span-2">
              <SingleImageField label="Logo" id="logo" value={settings.logo} onChange={(v) => update("logo", v)} />
            </div>
            <Field label="Footer Text" value={settings.footerText} onChange={(v) => update("footerText", v)} />
          </div>
        </TabsContent>

        <TabsContent value="hero">
          <div className="grid gap-5 rounded-2xl border border-border bg-white p-6">
            <Field label="Hero Title" value={settings.heroTitle} onChange={(v) => update("heroTitle", v)} />
            <div className="flex flex-col gap-1.5">
              <Label>Hero Subtitle</Label>
              <Textarea rows={2} value={settings.heroSubtitle} onChange={(e) => update("heroSubtitle", e.target.value)} />
            </div>
            <SingleImageField label="Hero Image" id="heroImage" value={settings.heroImage} onChange={(v) => update("heroImage", v)} />
            <div className="flex flex-col gap-1.5">
              <Label>About Text</Label>
              <Textarea rows={4} value={settings.aboutText ?? ""} onChange={(e) => update("aboutText", e.target.value)} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contact">
          <div className="grid gap-5 rounded-2xl border border-border bg-white p-6 sm:grid-cols-2">
            <Field label="Phone" value={settings.phone} onChange={(v) => update("phone", v)} placeholder="+91 98765 43210" />
            <Field label="WhatsApp Number" value={settings.whatsapp} onChange={(v) => update("whatsapp", v)} placeholder="919876543210" />
            <Field label="Email" value={settings.email} onChange={(v) => update("email", v)} type="email" />
            <Field label="Google Maps Embed URL" value={settings.googleMapsUrl} onChange={(v) => update("googleMapsUrl", v)} />
            <div className="sm:col-span-2">
              <Label>Address</Label>
              <Textarea rows={2} value={settings.address ?? ""} onChange={(e) => update("address", e.target.value)} className="mt-1.5" />
            </div>
            <Field label="Business Hours" value={settings.businessHours} onChange={(v) => update("businessHours", v)} placeholder="Mon - Sat: 9:00 AM - 6:00 PM" />
          </div>
        </TabsContent>

        <TabsContent value="social">
          <div className="grid gap-5 rounded-2xl border border-border bg-white p-6 sm:grid-cols-2">
            <Field label="Facebook URL" value={settings.socialLinks?.facebook} onChange={(v) => updateNested("socialLinks", { facebook: v })} />
            <Field label="Instagram URL" value={settings.socialLinks?.instagram} onChange={(v) => updateNested("socialLinks", { instagram: v })} />
            <Field label="Twitter / X URL" value={settings.socialLinks?.twitter} onChange={(v) => updateNested("socialLinks", { twitter: v })} />
            <Field label="LinkedIn URL" value={settings.socialLinks?.linkedin} onChange={(v) => updateNested("socialLinks", { linkedin: v })} />
            <Field label="YouTube URL" value={settings.socialLinks?.youtube} onChange={(v) => updateNested("socialLinks", { youtube: v })} />
          </div>
        </TabsContent>

        <TabsContent value="stats">
          <div className="rounded-2xl border border-border bg-white p-6">
            <p className="mb-4 text-sm text-muted-foreground">
              Leave a field blank to show &quot;--&quot; on the homepage instead of an unverified number.
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Projects Completed"
                type="number"
                value={settings.statistics?.projectsCompleted}
                onChange={(v) => updateNested("statistics", { projectsCompleted: v ? Number(v) : undefined })}
              />
              <Field
                label="kW Installed"
                type="number"
                value={settings.statistics?.kwInstalled}
                onChange={(v) => updateNested("statistics", { kwInstalled: v ? Number(v) : undefined })}
              />
              <Field
                label="Happy Customers"
                type="number"
                value={settings.statistics?.happyCustomers}
                onChange={(v) => updateNested("statistics", { happyCustomers: v ? Number(v) : undefined })}
              />
              <Field
                label="Years Experience"
                type="number"
                value={settings.statistics?.yearsExperience}
                onChange={(v) => updateNested("statistics", { yearsExperience: v ? Number(v) : undefined })}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="calculator">
          <div className="rounded-2xl border border-border bg-white p-6">
            <p className="mb-4 text-sm text-muted-foreground">
              These assumptions drive the solar savings calculator. Update them to reflect your local tariff and conditions.
            </p>
            <div className="grid gap-5 sm:grid-cols-3">
              <Field
                label="Cost per kWh"
                type="number"
                value={settings.calculatorConfig.costPerKwh}
                onChange={(v) => updateNested("calculatorConfig", { costPerKwh: Number(v) })}
              />
              <Field
                label="Sun Hours / Day"
                type="number"
                value={settings.calculatorConfig.sunHours}
                onChange={(v) => updateNested("calculatorConfig", { sunHours: Number(v) })}
              />
              <Field
                label="System Efficiency (0-1)"
                type="number"
                value={settings.calculatorConfig.systemEfficiency}
                onChange={(v) => updateNested("calculatorConfig", { systemEfficiency: Number(v) })}
              />
              <Field
                label="Cost per kW"
                type="number"
                value={settings.calculatorConfig.costPerKw}
                onChange={(v) => updateNested("calculatorConfig", { costPerKw: Number(v) })}
              />
              <Field
                label="Annual Degradation (0-1)"
                type="number"
                value={settings.calculatorConfig.annualDegradation}
                onChange={(v) => updateNested("calculatorConfig", { annualDegradation: Number(v) })}
              />
              <Field
                label="Sq. ft. per kW"
                type="number"
                value={settings.calculatorConfig.sqftPerKw}
                onChange={(v) => updateNested("calculatorConfig", { sqftPerKw: Number(v) })}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="seo">
          <div className="grid gap-5 rounded-2xl border border-border bg-white p-6">
            <Field label="Default SEO Title" value={settings.defaultSEO?.title} onChange={(v) => updateNested("defaultSEO", { title: v })} />
            <div className="flex flex-col gap-1.5">
              <Label>Default SEO Description</Label>
              <Textarea
                rows={2}
                value={settings.defaultSEO?.description ?? ""}
                onChange={(e) => updateNested("defaultSEO", { description: e.target.value })}
              />
            </div>
            <Field
              label="Keywords (comma-separated)"
              value={settings.defaultSEO?.keywords?.join(", ")}
              onChange={(v) =>
                updateNested("defaultSEO", { keywords: v.split(",").map((k) => k.trim()).filter(Boolean) })
              }
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
