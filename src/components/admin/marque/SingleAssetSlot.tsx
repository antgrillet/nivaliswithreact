"use client";

import { useState } from "react";
import { ImagePlus, Replace, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SafeImage } from "@/components/SafeImage";
import MediaPickerDialog from "@/components/admin/MediaPickerDialog";

interface SingleAssetSlotProps {
  label: string;
  hint?: string;
  role: "logo" | "mainImage" | "produit";
  value: string;
  slug: string;
  nom: string;
  aspect?: "video" | "square";
  onChange: (url: string) => void;
  onClear: () => void;
}

/** Emplacement d'image à rôle unique : logo, image principale ou image produit. */
export default function SingleAssetSlot({
  label,
  hint,
  role,
  value,
  slug,
  nom,
  aspect = "video",
  onChange,
  onClear,
}: SingleAssetSlotProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const aspectClass = aspect === "square" ? "aspect-square" : "aspect-video";

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-2">
        <Label>{label}</Label>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>

      {value ? (
        <div className="space-y-2">
          <div
            className={`relative w-full overflow-hidden rounded-md border border-border bg-secondary/40 ${aspectClass}`}
          >
            <SafeImage
              src={value}
              alt={label}
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
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className={`flex w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-secondary/30 text-muted-foreground transition-colors hover:border-foreground/40 hover:bg-secondary/50 ${aspectClass}`}
        >
          <ImagePlus className="size-5" />
          <span className="text-sm">Choisir une image</span>
        </button>
      )}

      <MediaPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={onChange}
        accept="image"
        uploadPrefix={`marques/${slug}/${role}`}
        payload={{ marque: nom, type: role }}
        title={`Image — ${label}`}
      />
    </div>
  );
}
