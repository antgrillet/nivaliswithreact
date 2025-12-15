"use client";

import { useState, useEffect, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarquesList from "@/components/marques/MarquesList";
import MarquesHeader from "@/components/marques/MarquesHeader";
import MarquesStatistics from "@/components/marques/MarquesStatistics";
import MarquesFilterClient from "@/components/marques/MarquesFilterClient";
import { MarquesData } from "@/app/utils/types";

export default function MarquesPage() {
  const [searchTerm] = useState("");
  const [activeFilter] = useState("Toutes");
  const [marqueData, setMarqueData] = useState<MarquesData | null>(null);
  const [filteredMarques, setFilteredMarques] = useState<MarquesData["marques"]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeType] = useState("Tous types");

  // Charger les données depuis l'API
  useEffect(() => {
    const fetchMarques = async () => {
      try {
        const response = await fetch('/api/cms/marques');
        const data = await response.json();
        setMarqueData(data);
        setFilteredMarques(data.marques);
      } catch (error) {
        console.error('Erreur lors du chargement des marques:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarques();
  }, []);

  // Filtrer les marques en fonction des filtres et de la recherche
  useEffect(() => {
    if (!marqueData) return;
    
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
  }, [searchTerm, activeFilter, activeType, marqueData]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-amber-50/60 to-white">
        <Navbar />
        <MarquesHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-4 mb-8">
            <Skeleton className="h-8 w-1/2 mx-auto" />
            <Skeleton className="h-4 w-2/3 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!marqueData) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-amber-50/60 to-white">
        <Navbar />
        <MarquesHeader />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-red-600">Erreur lors du chargement des marques</p>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50/60 to-white">
      <Navbar />
      <MarquesHeader />

      <Suspense
        fallback={
          <div className="container mx-auto px-4 py-4">
            <Skeleton className="h-12 w-full" />
          </div>
        }
      >
        <MarquesFilterClient marques={marqueData.marques} />
      </Suspense>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <Suspense
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-6 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            }
          >
            <MarquesList marques={marqueData.marques} />
          </Suspense>
        </div>
      </section>

      <MarquesStatistics marquesData={marqueData} />
      <Footer />
    </main>
  );
}
