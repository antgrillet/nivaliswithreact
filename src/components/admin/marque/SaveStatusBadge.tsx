"use client";

import { Loader2, Check, AlertTriangle } from "lucide-react";

export type SaveState = "idle" | "dirty" | "saving" | "saved" | "error";

/** Indicateur d'état de la sauvegarde explicite (feedback de l'en-tête). */
export default function SaveStatusBadge({ state }: { state: SaveState }) {
  switch (state) {
    case "saving":
      return (
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Loader2 className="size-3.5 animate-spin" />
          Enregistrement…
        </span>
      );
    case "saved":
      return (
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Check className="size-3.5" />
          Enregistré
        </span>
      );
    case "dirty":
      return (
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span
            className="size-1.5 rounded-full bg-foreground"
            aria-hidden="true"
          />
          Modifications non enregistrées
        </span>
      );
    case "error":
      return (
        <span className="flex items-center gap-1.5 text-xs text-destructive">
          <AlertTriangle className="size-3.5" />
          Échec — réessayer
        </span>
      );
    default:
      return null;
  }
}
