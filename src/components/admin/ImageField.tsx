"use client";

import { useState } from "react";
import { ImagePlus, Trash2, Replace } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SafeImage } from "@/components/SafeImage";
import MediaPickerDialog from "@/components/admin/MediaPickerDialog";
import type { UploadPayload } from "@/lib/admin/upload";

interface ImageFieldProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  onClear?: () => void;
  uploadPrefix?: string;
  payload?: UploadPayload;
  /** Aspect de l'aperçu. */
  aspect?: "square" | "video" | "auto";
}

const ASPECT: Record<string, string> = {
  square: "aspect-square",
  video: "aspect-video",
  auto: "min-h-32",
};

/** Champ image réutilisable : aperçu + choix via la médiathèque + suppression. */
export default function ImageField({
  label,
  value,
  onChange,
  onClear,
  uploadPrefix = "uploads",
  payload,
  aspect = "video",
}: ImageFieldProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}

      {value ? (
        <div className="space-y-2">
          <div
            className={`relative w-full overflow-hidden rounded-md border border-border bg-secondary/40 ${ASPECT[aspect]}`}
          >
            <SafeImage
              src={value}
              alt={label ?? "Aperçu"}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-contain"
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPickerOpen(true)}
            >
              <Replace className="size-3.5" />
              Remplacer
            </Button>
            {onClear && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={onClear}
              >
                <Trash2 className="size-3.5" />
                Retirer
              </Button>
            )}
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="h-auto w-full flex-col gap-2 border-dashed py-8 text-muted-foreground"
          onClick={() => setPickerOpen(true)}
        >
          <ImagePlus className="size-5" />
          <span className="text-sm">Choisir une image</span>
        </Button>
      )}

      <MediaPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={onChange}
        uploadPrefix={uploadPrefix}
        payload={payload}
        title={label ? `Image — ${label}` : "Choisir une image"}
      />
    </div>
  );
}
