import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface Stat {
  label: string;
  value: ReactNode;
  hint?: string;
  /** Si fourni, la carte devient un lien vers cette section. */
  href?: string;
}

/** Bandeau de compteurs sobre pour le tableau de bord (server component). */
export default function DashboardStats({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const body = (
          <>
            <div className="flex items-start justify-between">
              <p className="eyebrow">{stat.label}</p>
              {stat.href && (
                <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              )}
            </div>
            <p className="mt-3 font-serif text-3xl tracking-tight tabular-nums">
              {stat.value}
            </p>
            {stat.hint && (
              <p className="mt-1 text-xs text-muted-foreground">{stat.hint}</p>
            )}
          </>
        );

        return stat.href ? (
          <Link
            key={stat.label}
            href={stat.href}
            className="group bg-card p-6 transition-colors hover:bg-secondary/50"
          >
            {body}
          </Link>
        ) : (
          <div key={stat.label} className="bg-card p-6">
            {body}
          </div>
        );
      })}
    </div>
  );
}
