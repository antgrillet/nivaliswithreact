"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MarqueData } from "@/app/utils/types";

interface MarquesListProps {
  marques: MarqueData[];
}

export default function MarquesList({ marques }: MarquesListProps) {
  const searchParams = useSearchParams();
  const [visibleCount, setVisibleCount] = useState(6);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Récupérer les paramètres de recherche
  const searchTerm = searchParams.get("q") || "";
  const activeFilter = searchParams.get("tag") || "Toutes";
  const activeType = searchParams.get("type") || "Tous types";
  const showFavorites = searchParams.get("favorites") === "true";

  // Filtrer les marques en fonction des paramètres d'URL
  const filteredMarques = useMemo(() => {
    let results = marques;

    // Filtrer par tag
    if (activeFilter !== "Toutes") {
      results = results.filter((marque) => marque.tags.includes(activeFilter));
    }

    // Filtrer par type
    if (activeType !== "Tous types") {
      results = results.filter((marque) => marque.type === activeType);
    }

    // Filtrer par recherche
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        (marque) =>
          marque.nom.toLowerCase().includes(term) ||
          marque.description.toLowerCase().includes(term) ||
          marque.type.toLowerCase().includes(term)
      );
    }

    // Filtrer par favoris
    if (showFavorites) {
      results = results.filter((marque) => favorites.includes(marque.nom));
    }

    return results;
  }, [marques, activeFilter, activeType, searchTerm, showFavorites, favorites]);

  // Charger les favoris depuis le localStorage
  useEffect(() => {
    const storedFavorites = localStorage.getItem("marquesFavorites");
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (error) {
        console.error("Erreur lors du chargement des favoris:", error);
      }
    }
    setIsLoading(false);
  }, []);

  // Sauvegarder les favoris dans le localStorage
  useEffect(() => {
    if (favorites.length > 0) {
      localStorage.setItem("marquesFavorites", JSON.stringify(favorites));
    }
  }, [favorites]);

  // Ajouter/Supprimer des favoris
  const toggleFavorite = (nom: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setFavorites((prev) => {
      if (prev.includes(nom)) {
        return prev.filter((item) => item !== nom);
      } else {
        return [...prev, nom];
      }
    });
  };

  // Charger plus de marques
  const loadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-white rounded-xl h-80 shadow-md"
          ></div>
        ))}
      </div>
    );
  }

  if (filteredMarques.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20"
      >
        <h3 className="text-2xl font-bold text-amber-800 mb-4">
          Aucune marque ne correspond à votre recherche
        </h3>
        <p className="text-amber-700 mb-6">
          Essayez de modifier vos critères de recherche ou de réinitialiser les
          filtres.
        </p>
        <Link href="/marques">
          <button className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-md transition-colors">
            Réinitialiser les filtres
          </button>
        </Link>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {filteredMarques.slice(0, visibleCount).map((marque) => (
          <motion.div
            key={marque.nom}
            variants={item}
            layoutId={`marque-${marque.nom}`}
          >
            <Link
              href={`/marques/${marque.nom.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl h-full border border-amber-100 hover:border-amber-300 hover:-translate-y-1 bg-white group">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-amber-100">
                  <Image
                    src={marque.mainImage}
                    alt={`Image de ${marque.nom}`}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500 brightness-[1.05]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={filteredMarques.indexOf(marque) < 3}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-30 group-hover:opacity-70 transition-opacity duration-300"></div>

                  {/* Bouton favoris */}
                  <button
                    onClick={(e) => toggleFavorite(marque.nom, e)}
                    aria-label={
                      favorites.includes(marque.nom)
                        ? "Retirer des favoris"
                        : "Ajouter aux favoris"
                    }
                    className={cn(
                      "absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all",
                      favorites.includes(marque.nom)
                        ? "bg-amber-500 text-white"
                        : "bg-white/80 text-amber-700 hover:bg-white"
                    )}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill={
                        favorites.includes(marque.nom) ? "currentColor" : "none"
                      }
                      stroke="currentColor"
                      className="w-5 h-5"
                      strokeWidth={favorites.includes(marque.nom) ? "0" : "2"}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                      />
                    </svg>
                  </button>

                  <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="inline-block bg-amber-100/90 backdrop-blur-sm text-amber-900 text-xs px-2.5 py-1 rounded-full mb-2 font-medium">
                      {marque.type}
                    </span>
                    <p className="text-white text-sm line-clamp-3 drop-shadow-md">
                      {marque.description}
                    </p>
                  </div>
                </div>

                <CardContent className="p-6 relative">
                  <div className="absolute -top-10 left-4 h-16 w-16 bg-white rounded-full border-4 border-white shadow-md flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src={marque.logo}
                      alt={`Logo de ${marque.nom}`}
                      width={50}
                      height={50}
                      className="object-contain"
                    />
                  </div>

                  <div className="pt-6">
                    <h3 className="text-xl font-bold text-amber-900 mb-1">
                      {marque.nom}
                    </h3>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {marque.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-amber-700 text-sm line-clamp-2">
                      {marque.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {visibleCount < filteredMarques.length && (
        <div className="text-center mt-12">
          <button
            onClick={loadMore}
            className="px-6 py-3 bg-amber-700 hover:bg-amber-800 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            Voir plus de marques
          </button>
        </div>
      )}
    </>
  );
}
