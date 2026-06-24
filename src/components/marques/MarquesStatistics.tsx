import type { MarqueData } from "@/lib/types";

interface MarquesStatisticsProps {
  marques: MarqueData[];
}

/**
 * Bandeau de chiffres en grille à filets fins (esprit galerie monochrome).
 * Server Component — pas d'animation lourde, pas de couleur d'accent.
 */
export default function MarquesStatistics({ marques }: MarquesStatisticsProps) {
  const typesCount = new Set(
    marques.map((m) => m.type).filter(Boolean)
  ).size;
  const tagsCount = new Set(
    marques.flatMap((m) => m.tags ?? [])
  ).size;

  const stats: { value: string; label: string }[] = [
    { value: `${marques.length}`, label: "Marques en boutique" },
    { value: `${typesCount}`, label: "Univers représentés" },
    { value: `${tagsCount}`, label: "Catégories" },
  ];

  return (
    <section className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-xl">
          <p className="eyebrow">En chiffres</p>
          <h2 className="mt-4 font-serif text-3xl tracking-tight md:text-4xl">
            Une maison, une exigence
          </h2>
        </div>

        <dl className="mt-12 grid grid-cols-1 gap-px overflow-hidden border border-border bg-border sm:grid-cols-3">
          {stats.map(({ value, label }) => (
            <div key={label} className="bg-background p-10 text-center">
              <dt className="sr-only">{label}</dt>
              <dd className="font-serif text-4xl tracking-tight md:text-5xl">
                {value}
              </dd>
              <p className="mt-2 text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
