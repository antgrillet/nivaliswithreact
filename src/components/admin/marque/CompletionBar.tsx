"use client";

import type { Completion } from "@/lib/admin/marque-completion";

/** Jauge de complétude X/8 avec liste des manques au survol. */
export default function CompletionBar({ completion }: { completion: Completion }) {
  const { score, total, missing } = completion;
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <div
      className="flex items-center gap-2"
      title={
        missing.length > 0
          ? `À compléter : ${missing.join(", ")}`
          : "Fiche complète"
      }
    >
      <div
        role="progressbar"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`Complétude : ${score} sur ${total}`}
        className="h-1.5 w-24 overflow-hidden rounded-full bg-secondary"
      >
        <div
          className="h-full rounded-full bg-foreground transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs tabular-nums text-muted-foreground">
        {score}/{total}
      </span>
      {missing.length > 0 && (
        <span className="sr-only">À compléter : {missing.join(", ")}</span>
      )}
    </div>
  );
}
