import { useState } from "react";
import Link from "next/link";
import BrandCard from "@/components/BrandCard";
import { Button } from "@/components/ui/button";

interface Marque {
  nom: string;
  description: string;
  type: string;
  logo: string;
  mainImage: string;
  tags: string[];
}

interface BrandSectionProps {
  marques: Marque[];
}

export default function BrandSection({ marques }: BrandSectionProps) {
  const [activeFilter, setActiveFilter] = useState<string>("Toutes");

  // Extracting unique tags from all brands
  const allTags = [
    "Toutes",
    ...new Set(marques.flatMap((marque) => marque.tags)),
  ];

  const filteredMarques =
    activeFilter === "Toutes"
      ? marques
      : marques.filter((marque) => marque.tags.includes(activeFilter));

  return (
    <section className="py-16 px-4 bg-amber-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Nos marques partenaires
          </h2>
          <p className="text-amber-800 max-w-2xl mx-auto mb-8">
            Découvrez notre sélection exclusive de marques de qualité, chacune
            choisie pour son excellence et son engagement.
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveFilter(tag)}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 shadow-sm ${
                  activeFilter === tag
                    ? "bg-amber-700 text-amber-50 shadow-md scale-105"
                    : "bg-white text-amber-800 hover:bg-amber-100 border border-amber-200"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {filteredMarques.map((marque) => (
            <BrandCard
              key={marque.nom}
              nom={marque.nom}
              description={marque.description}
              type={marque.type}
              logo={marque.logo}
              mainImage={marque.mainImage}
            />
          ))}
        </div>

        <div className="text-center">
          <Link href="/marques">
            <Button className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-3 text-base shadow-md transition-all duration-300 hover:scale-105 border border-amber-600">
              Voir toutes nos marques
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
