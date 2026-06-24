interface MarquesHeaderProps {
  count: number;
  title?: string;
  subtitle?: string;
}

/**
 * En-tête éditorial de la page listing des marques.
 * Server Component statique — esprit galerie monochrome.
 */
export default function MarquesHeader({
  count,
  title = "Nos marques",
  subtitle = "Une sélection exigeante des plus grandes maisons outdoor et lifestyle, réunies au cœur des Gets. Chaque pièce est à découvrir et à essayer en boutique.",
}: MarquesHeaderProps) {
  return (
    <section className="border-b border-border bg-background pt-36 pb-16 md:pt-40 md:pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-3xl animate-fadeSlideUp">
          <p className="eyebrow">La sélection</p>
          <h1 className="mt-5 font-serif text-5xl tracking-tight md:text-7xl">
            {title}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {subtitle}
          </p>
          <p className="eyebrow mt-8">
            {count} {count > 1 ? "marques" : "marque"}
          </p>
        </div>
      </div>
    </section>
  );
}
