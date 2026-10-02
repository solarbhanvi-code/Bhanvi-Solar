"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { apiFetch, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ImageStage, ProjectImage } from "@/types";

const STAGES: { value: ImageStage; label: string }[] = [
  { value: "BEFORE", label: "Before" },
  { value: "INSTALLATION", label: "Installation" },
  { value: "COMPLETED", label: "Completed" },
];

export function ProjectImageUploader({
  images,
  onChange,
}: {
  images: ProjectImage[];
  onChange: (images: ProjectImage[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    const uploaded: ProjectImage[] = [];
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const result = await apiFetch<{ url: string; publicId: string }>("/uploads/image", {
          method: "POST",
          body: formData,
        });
        uploaded.push({ url: result.url, publicId: result.publicId, alt: "", stage: "COMPLETED" });
      }
      onChange([...images, ...uploaded]);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Image upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleRemove(index: number) {
    const image = images[index];
    onChange(images.filter((_, i) => i !== index));
    await apiFetch("/uploads/image/delete", {
      method: "POST",
      body: JSON.stringify({ publicId: image.publicId }),
    }).catch(() => undefined);
  }

  return (
    <div className="flex flex-col gap-3">
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((image, index) => (
            <div key={image.publicId + index} className="flex flex-col gap-1.5">
              <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-mist-100">
                <Image src={image.url} alt={image.alt || "Project image"} fill sizes="200px" className="object-cover" />
                <button
                  type="button"
                  onClick={() => void handleRemove(index)}
                  aria-label="Remove image"
                  className="absolute right-1.5 top-1.5 flex size-7 items-center justify-center rounded-full bg-ink-950/70 text-white hover:bg-red-600"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
              <Select
                value={image.stage}
                onValueChange={(stage) =>
                  onChange(images.map((img, i) => (i === index ? { ...img, stage: stage as ImageStage } : img)))
                }
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STAGES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      )}

      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/avif"
          multiple
          className="hidden"
          id="project-image-upload-input"
          onChange={(e) => void handleFiles(e.target.files)}
        />
        <Button type="button" variant="outline" onClick={() => inputRef.current?.click()} disabled={uploading}>
          {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
          {uploading ? "Uploading..." : "Upload images"}
        </Button>
      </div>
    </div>
  );
}
