"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import marqueData from "@/data/marque.json";
import { motion, AnimatePresence } from "framer-motion";

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

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50/60 to-white">
      <Navbar />

      {/* Hero de la page avec animation */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative pt-28 pb-16 bg-gradient-to-b from-amber-100/70 to-amber-50/40 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-5 pattern-dots"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-amber-200/20 -skew-x-12 transform -translate-x-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold mb-4 text-amber-900"
            >
              Nos marques partenaires
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg text-amber-800 mb-6 max-w-2xl mx-auto"
            >
              Découvrez notre sélection exclusive de marques de qualité,
              choisies avec soin pour leur excellence, leur authenticité et leur
              engagement.
            </motion.p>
          </div>
        </div>
      </motion.section>

      {/* Bouton pour afficher/masquer les filtres */}
      <div className="bg-white border-y border-amber-100 py-4 sticky top-16 z-30 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-amber-900">
              {!isLoading && filteredMarques.length > 0 && (
                <>
                  {filteredMarques.length}{" "}
                  {filteredMarques.length > 1
                    ? "marques trouvées"
                    : "marque trouvée"}
                </>
              )}
            </h2>
            <button
              onClick={() => setFiltersVisible(!filtersVisible)}
              className="flex items-center gap-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
                />
              </svg>
              Filtrer
              <span className="text-xs bg-amber-700 text-white px-2 py-0.5 rounded-full ml-1">
                {activeFilter !== "Toutes" ||
                activeType !== "Tous types" ||
                searchTerm
                  ? "Actif"
                  : ""}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Section filtres dépliable */}
      <AnimatePresence>
        {filtersVisible && (
          <motion.section
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white border-b border-amber-100 overflow-hidden z-20"
          >
            <div className="container mx-auto px-4 py-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col md:flex-row gap-6 justify-between items-start"
              >
                {/* Barre de recherche améliorée */}
                <div className="w-full md:w-1/3">
                  <label className="block text-amber-900 text-sm font-medium mb-2">
                    Rechercher
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5 text-amber-500"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <input
                      type="search"
                      placeholder="Rechercher une marque..."
                      className="block w-full pl-10 pr-4 py-3 border border-amber-200 rounded-lg bg-amber-50/50 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* Filtres améliorés */}
                <div className="flex flex-col lg:flex-row gap-6 w-full md:w-2/3">
                  <div className="w-full lg:w-1/2">
                    <label className="block text-amber-900 text-sm font-medium mb-2">
                      Filtrer par catégorie
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setActiveFilter(tag)}
                          className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                            activeFilter === tag
                              ? "bg-amber-700 text-amber-50 shadow-md"
                              : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="w-full lg:w-1/2">
                    <label className="block text-amber-900 text-sm font-medium mb-2">
                      Filtrer par type
                    </label>
                    <select
                      value={activeType}
                      onChange={(e) => setActiveType(e.target.value)}
                      className="block w-full py-2 px-3 border border-amber-200 rounded-lg bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                    >
                      {allTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>

              {/* Actions des filtres */}
              {(activeFilter !== "Toutes" ||
                activeType !== "Tous types" ||
                searchTerm) && (
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setActiveFilter("Toutes");
                      setActiveType("Tous types");
                    }}
                    className="text-sm text-amber-700 hover:text-amber-900 flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 mr-1"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Réinitialiser les filtres
                  </button>
                </div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Liste des marques avec animation */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-white rounded-xl h-80 shadow-md"
                ></div>
              ))}
            </div>
          ) : filteredMarques.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <h3 className="text-2xl font-bold text-amber-800 mb-4">
                Aucune marque ne correspond à votre recherche
              </h3>
              <p className="text-amber-700 mb-6">
                Essayez de modifier vos critères de recherche ou de
                réinitialiser les filtres.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setActiveFilter("Toutes");
                  setActiveType("Tous types");
                }}
                className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-md transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </motion.div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                {(activeFilter !== "Toutes" ||
                  activeType !== "Tous types" ||
                  searchTerm) && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setActiveFilter("Toutes");
                      setActiveType("Tous types");
                    }}
                    className="text-sm text-amber-700 hover:text-amber-900 flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 mr-1"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Effacer les filtres
                  </button>
                )}
              </div>

              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredMarques.slice(0, visibleCount).map((marque) => (
                  <motion.div key={marque.nom} variants={item}>
                    <Link
                      href={`/marques/${marque.nom
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl h-full border border-amber-100 hover:border-amber-300 hover:-translate-y-1 bg-white group">
                        <div className="relative h-60 w-full bg-amber-100">
                          <Image
                            src={marque.mainImage}
                            alt={`Image de ${marque.nom}`}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                            <span className="inline-block bg-amber-100 text-amber-900 text-xs px-2 py-1 rounded mb-2">
                              {marque.type}
                            </span>
                            <p className="text-white text-sm line-clamp-3">
                              {marque.description}
                            </p>
                          </div>
                        </div>

                        <CardContent className="p-6 relative">
                          <div className="absolute -top-10 left-4 h-16 w-16 bg-white rounded-full border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
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
          )}
        </div>
      </section>

      {/* Section statistiques */}
      <section className="py-16 bg-amber-100/40 border-t border-amber-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 rounded-xl shadow-md text-center"
            >
              <div className="text-4xl font-bold text-amber-700 mb-2">
                {marqueData.marques.length}
              </div>
              <p className="text-amber-900">Marques partenaires</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-8 rounded-xl shadow-md text-center"
            >
              <div className="text-4xl font-bold text-amber-700 mb-2">
                {allTypes.length - 1}
              </div>
              <p className="text-amber-900">Catégories différentes</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white p-8 rounded-xl shadow-md text-center"
            >
              <div className="text-4xl font-bold text-amber-700 mb-2">100%</div>
              <p className="text-amber-900">Satisfaction client</p>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
