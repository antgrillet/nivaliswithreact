import Link from "next/link";
import BrandCard from "@/components/BrandCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { MarqueData } from "@/lib/types";

interface BrandSectionProps {
  brands?: MarqueData[];
  content?: { title?: string; subtitle?: string };
}

export default function BrandSection({
  brands = [],
  content,
}: BrandSectionProps) {
  const list = brands.slice(0, 8);
  const stats: [string, string][] = [
    [`${brands.length}+`, "Marques en boutique"],
    ["50 m²", "D'espace dédié"],
    ["7j/7", "Ouvert toute la semaine"],
  ];

  return (
    <section className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="eyebrow">La sélection</p>
            <h2 className="mt-4 font-serif text-4xl tracking-tight md:text-5xl">
              {content?.title || "Nos marques en boutique"}
            </h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              {content?.subtitle ||
                "Une sélection exclusive des plus grandes maisons outdoor et lifestyle. Notre équipe vous accueille pour vous conseiller et vous faire essayer chaque pièce."}
            </p>
          </div>
          <Button asChild variant="outline" className="self-start md:self-auto">
            <Link href="/marques">
              Voir toutes les marques
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
          {list.map((brand, i) => (
            <BrandCard
              key={brand.nom}
              nom={brand.nom}
              displayName={brand.displayName}
              type={brand.type}
              mainImage={brand.mainImage}
              priority={i < 4}
            />
          ))}
        </div>

        <div className="mt-24 grid grid-cols-1 gap-px overflow-hidden border border-border bg-border sm:grid-cols-3">
          {stats.map(([value, label]) => (
            <div key={label} className="bg-background p-10 text-center">
              <p className="font-serif text-4xl tracking-tight md:text-5xl">
                {value}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
