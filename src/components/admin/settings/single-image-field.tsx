"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { apiFetch, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SingleImageField({
  label,
  value,
  onChange,
  id,
}: {
  label: string;
  value: string | undefined;
  onChange: (url: string | undefined) => void;
  id: string;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await apiFetch<{ url: string }>("/uploads/image", { method: "POST", body: formData });
      onChange(result.url);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-3">
        {value && (
          <div className="relative size-14 overflow-hidden rounded-lg border border-border bg-mist-100">
            <Image src={value} alt={label} fill sizes="56px" className="object-cover" />
          </div>
        )}
        <Input id={id} value={value ?? ""} onChange={(e) => onChange(e.target.value || undefined)} placeholder="Image URL" className="flex-1" />
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/avif"
          className="hidden"
          onChange={(e) => void handleFile(e.target.files)}
        />
        <Button type="button" variant="outline" size="icon" onClick={() => inputRef.current?.click()} disabled={uploading}>
          {uploading ? <Loader2 className="animate-spin" /> : <Upload className="size-4" />}
        </Button>
        {value && (
          <Button type="button" variant="outline" size="icon" onClick={() => onChange(undefined)}>
            <Trash2 className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
