"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Star, X } from "lucide-react";
import { SafeImage } from "@/components/SafeImage";
import { cn } from "@/lib/utils";

interface SortableThumbProps {
  url: string;
  isMain: boolean;
  selected: boolean;
  onToggleSelect: () => void;
  onSetMain: () => void;
  onRemove: () => void;
}

/** Vignette de galerie triable (glisser pour réordonner) avec actions de rôle. */
export default function SortableThumb({
  url,
  isMain,
  selected,
  onToggleSelect,
  onSetMain,
  onRemove,
}: SortableThumbProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: url });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative aspect-square overflow-hidden rounded-md border bg-secondary/40",
        isDragging ? "z-10 border-foreground shadow-lg" : "border-border",
        selected && "ring-2 ring-foreground ring-offset-1 ring-offset-background"
      )}
    >
      <SafeImage
        src={url}
        alt="Image de galerie"
        fill
        sizes="(max-width: 640px) 33vw, 160px"
        className="object-cover"
      />

      {/* Sélection (lot) */}
      <label
        className="absolute left-1.5 top-1.5 flex size-6 cursor-pointer items-center justify-center rounded bg-background/85 backdrop-blur-sm"
        title="Sélectionner"
      >
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggleSelect}
          aria-label="Sélectionner cette image"
          className="size-3.5 accent-foreground"
        />
      </label>

      {/* Poignée de déplacement */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="absolute right-1.5 top-1.5 flex size-6 cursor-grab touch-none items-center justify-center rounded bg-background/85 text-foreground opacity-0 backdrop-blur-sm transition-opacity hover:bg-background group-hover:opacity-100 active:cursor-grabbing"
        aria-label="Déplacer l’image"
      >
        <GripVertical className="size-3.5" />
      </button>

      {/* Badge image principale */}
      {isMain && (
        <span className="eyebrow absolute bottom-1.5 left-1.5 rounded bg-foreground px-1.5 py-0.5 text-[0.6rem] text-background">
          Principale
        </span>
      )}

      {/* Actions au survol */}
      <div className="absolute bottom-1.5 right-1.5 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          onClick={onSetMain}
          title={isMain ? "Image principale" : "Définir comme image principale"}
          aria-label="Définir comme image principale"
          className="flex size-6 items-center justify-center rounded bg-background/85 text-foreground backdrop-blur-sm transition-colors hover:bg-background"
        >
          <Star className={cn("size-3.5", isMain && "fill-current")} />
        </button>
        <button
          type="button"
          onClick={onRemove}
          title="Retirer de la galerie"
          aria-label="Retirer de la galerie"
          className="flex size-6 items-center justify-center rounded bg-background/85 text-foreground backdrop-blur-sm transition-colors hover:bg-background"
        >
          <X className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
