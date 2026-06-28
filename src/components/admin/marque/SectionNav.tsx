"use client";

import { Check, AlertCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SectionStatus } from "@/lib/admin/marque-completion";

export interface NavSection {
  id: string;
  label: string;
  status: SectionStatus;
  dirty: boolean;
}

const STATUS_LABEL: Record<SectionStatus, string> = {
  ok: "section complète",
  warn: "à compléter",
  empty: "vide",
};

function StatusIcon({ status }: { status: SectionStatus }) {
  return (
    <span role="img" aria-label={STATUS_LABEL[status]}>
      {status === "ok" ? (
        <Check className="size-3.5" />
      ) : status === "warn" ? (
        <AlertCircle className="size-3.5" />
      ) : (
        <Circle className="size-2.5" />
      )}
    </span>
  );
}

/** Rail de navigation des sections (scroll-spy géré par le parent). */
export default function SectionNav({
  sections,
  activeId,
}: {
  sections: NavSection[];
  activeId: string;
}) {
  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <nav className="flex flex-row flex-wrap gap-1 lg:flex-col">
      {sections.map((s) => {
        const active = s.id === activeId;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => go(s.id)}
            aria-current={active ? "true" : undefined}
            className={cn(
              "flex items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors",
              active
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <span className="flex items-center gap-2">
              <span className={cn(active ? "text-background/70" : "opacity-70")}>
                <StatusIcon status={s.status} />
              </span>
              {s.label}
            </span>
            {s.dirty && (
              <span
                className={cn(
                  "size-1.5 shrink-0 rounded-full",
                  active ? "bg-background" : "bg-foreground"
                )}
                aria-hidden="true"
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
