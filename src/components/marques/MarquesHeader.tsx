import { ArrowDown } from "lucide-react";
import { SafeImage } from "@/components/SafeImage";
import type { MarqueData } from "@/lib/types";

interface MarquesHeaderProps {
  count: number;
  marques: MarqueData[];
  title?: string;
  subtitle?: string;
}

/**
 * En-tête éditorial de la page listing des marques.
 * Server Component statique — esprit galerie monochrome.
 */
export default function MarquesHeader({
  count,
  marques,
  title = "Nos marques",
  subtitle = "Une sélection exigeante des plus grandes maisons outdoor et lifestyle, réunies au cœur des Gets. Chaque pièce est à découvrir et à essayer en boutique.",
}: MarquesHeaderProps) {
  const featured = marques.filter((marque) => Boolean(marque.mainImage)).slice(0, 2);

  return (
    <section className="border-b border-border bg-background pt-20">
      <div className="mx-auto grid max-w-7xl lg:grid-cols-12 lg:px-10">
        <div className="flex min-h-[27rem] animate-fadeSlideUp flex-col justify-center px-6 py-16 lg:col-span-5 lg:min-h-[34rem] lg:px-0 lg:pr-16">
          <div>
            <p className="eyebrow">La sélection Nivalis</p>
            <h1 className="mt-5 max-w-lg text-balance font-serif text-5xl leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              {title}
            </h1>
            <p className="mt-7 max-w-md text-pretty text-base leading-relaxed text-muted-foreground lg:text-lg">
              {subtitle}
            </p>
          </div>

          <div className="mt-10 flex items-center justify-between border-t border-border pt-5">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{count}</span>{" "}
              {count > 1 ? "maisons sélectionnées" : "maison sélectionnée"}
            </p>
            <a
              href="#selection"
              className="flex size-11 items-center justify-center border border-border transition-colors hover:border-foreground hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="Découvrir la sélection"
            >
              <ArrowDown className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="relative min-h-[24rem] overflow-hidden bg-muted lg:col-span-7 lg:min-h-[34rem]">
          {featured[0] ? (
            <SafeImage
              src={featured[0].mainImage}
              alt={featured[0].displayName?.trim() || featured[0].nom}
              fill
              priority
              fallbackLabel={featured[0].nom.charAt(0)}
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 58vw"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/35 via-transparent to-transparent" />

          {featured[1] ? (
            <div className="absolute bottom-5 right-5 hidden w-40 border-4 border-background bg-muted shadow-2xl sm:block lg:bottom-8 lg:right-8 lg:w-48">
              <div className="relative aspect-[4/5]">
                <SafeImage
                  src={featured[1].mainImage}
                  alt={featured[1].displayName?.trim() || featured[1].nom}
                  fill
                  fallbackLabel={featured[1].nom.charAt(0)}
                  className="object-cover"
                  sizes="192px"
                />
              </div>
            </div>
          ) : null}

          <p className="absolute bottom-6 left-6 max-w-[calc(100%-13rem)] text-xs uppercase tracking-[0.18em] text-white lg:bottom-8 lg:left-8">
            À découvrir aux Gets
          </p>
        </div>
      </div>
    </section>
  );
}
