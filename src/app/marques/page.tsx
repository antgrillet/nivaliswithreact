"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import marqueData from "@/data/marque.json";
import { motion, AnimatePresence } from "framer-motion";
import MarquesList from "@/components/marques/MarquesList";
import MarquesHeader from "@/components/marques/MarquesHeader";
import MarquesStatistics from "@/components/marques/MarquesStatistics";
import MarquesFilterClient from "@/components/marques/MarquesFilterClient";
import { MarquesData } from "@/app/utils/types";

export default function MarquesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("Toutes");
  const [filteredMarques, setFilteredMarques] = useState(marqueData.marques);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);
  const [filtersVisible, setFiltersVisible] = useState(false);

  // Extraire tous les tags et types uniques
  const allTags = [
    "Toutes",
    ...new Set(marqueData.marques.flatMap((marque) => marque.tags)),
  ];
  const allTypes = [
    "Tous types",
    ...new Set(marqueData.marques.map((marque) => marque.type)),
  ];
  const [activeType, setActiveType] = useState("Tous types");

  // Filtrer les marques en fonction des filtres et de la recherche
  useEffect(() => {
    let results = marqueData.marques;

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

    setFilteredMarques(results);
    setIsLoading(false);
  }, [searchTerm, activeFilter, activeType]);

  // Gérer le chargement des éléments supplémentaires
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

  // Type casting pour assurer la cohérence des types
  const typedMarqueData = marqueData as MarquesData;

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50/60 to-white">
      <Navbar />
      <MarquesHeader />

      <Suspense
        fallback={
          <div className="container mx-auto px-4 py-8 text-center">
            Chargement des filtres...
          </div>
        }
      >
        <MarquesFilterClient marques={typedMarqueData.marques} />
      </Suspense>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <Suspense
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse bg-white rounded-xl h-80 shadow-md"
                  ></div>
                ))}
              </div>
            }
          >
            <MarquesList marques={typedMarqueData.marques} />
          </Suspense>
        </div>
      </section>

      <MarquesStatistics marquesData={typedMarqueData} />
      <Footer />
    </main>
  );
}
