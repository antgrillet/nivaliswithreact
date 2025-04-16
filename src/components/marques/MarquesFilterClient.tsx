"use client";

import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useTransition,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MarqueData } from "@/app/utils/types";
import debounce from "lodash.debounce";

interface MarquesFilterClientProps {
  marques: MarqueData[];
}

export default function MarquesFilterClient({
  marques,
}: MarquesFilterClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // États
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [activeFilter, setActiveFilter] = useState(
    searchParams.get("tag") || "Toutes"
  );
  const [activeType, setActiveType] = useState(
    searchParams.get("type") || "Tous types"
  );
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filteredCount, setFilteredCount] = useState(marques.length);

  // Extraction des tags et types uniques (useMemo pour optimiser)
  const allTags = useMemo(
    () => ["Toutes", ...new Set(marques.flatMap((marque) => marque.tags))],
    [marques]
  );

  const allTypes = useMemo(
    () => ["Tous types", ...new Set(marques.map((marque) => marque.type))],
    [marques]
  );

  // Débouncer la recherche
  const debouncedUpdateUrl = useCallback(
    debounce((newParams: URLSearchParams) => {
      startTransition(() => {
        router.push(`?${newParams.toString()}`, { scroll: false });
      });
    }, 300),
    [router]
  );

  // Filtrage pour le comptage
  useEffect(() => {
    let results = marques;

    if (activeFilter !== "Toutes") {
      results = results.filter((marque) => marque.tags.includes(activeFilter));
    }

    if (activeType !== "Tous types") {
      results = results.filter((marque) => marque.type === activeType);
    }

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        (marque) =>
          marque.nom.toLowerCase().includes(term) ||
          marque.description.toLowerCase().includes(term) ||
          marque.type.toLowerCase().includes(term)
      );
    }

    setFilteredCount(results.length);
  }, [searchTerm, activeFilter, activeType, marques]);

  // Mettre à jour l'URL lorsque les filtres changent
  useEffect(() => {
    const params = new URLSearchParams();

    if (searchTerm) params.set("q", searchTerm);
    if (activeFilter !== "Toutes") params.set("tag", activeFilter);
    if (activeType !== "Tous types") params.set("type", activeType);

    debouncedUpdateUrl(params);
  }, [searchTerm, activeFilter, activeType, debouncedUpdateUrl]);

  // Réinitialiser les filtres
  const resetFilters = useCallback(() => {
    setSearchTerm("");
    setActiveFilter("Toutes");
    setActiveType("Tous types");
    router.push("/marques", { scroll: false });
  }, [router]);

  // Vérifier si des filtres sont actifs
  const hasActiveFilters =
    activeFilter !== "Toutes" ||
    activeType !== "Tous types" ||
    searchTerm !== "";

  return (
    <>
      {/* Barre de filtres collante */}
      <div className="bg-white border-y border-amber-100 py-4 sticky top-16 z-30 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-amber-900">
              {filteredCount}{" "}
              {filteredCount > 1 ? "marques trouvées" : "marque trouvée"}
              {isPending && (
                <span className="ml-2 text-amber-500 animate-pulse">
                  Mise à jour...
                </span>
              )}
            </h2>
            <button
              onClick={() => setFiltersVisible(!filtersVisible)}
              className="flex items-center gap-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg transition-all"
              aria-expanded={filtersVisible}
              aria-controls="filter-panel"
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
              {hasActiveFilters && (
                <span className="text-xs bg-amber-700 text-white px-2 py-0.5 rounded-full ml-1">
                  Actif
                </span>
              )}
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
            id="filter-panel"
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
                  <label
                    htmlFor="search-input"
                    className="block text-amber-900 text-sm font-medium mb-2"
                  >
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
                      id="search-input"
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
                    <label
                      htmlFor="type-select"
                      className="block text-amber-900 text-sm font-medium mb-2"
                    >
                      Filtrer par type
                    </label>
                    <select
                      id="type-select"
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
              {hasActiveFilters && (
                <div className="flex justify-end mt-4">
                  <button
                    onClick={resetFilters}
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

      {/* Bandeau de filtres actifs */}
      {hasActiveFilters && !filtersVisible && (
        <div className="bg-amber-50 border-b border-amber-100 py-2 px-4">
          <div className="container mx-auto">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-amber-800">Filtres actifs:</span>

              {searchTerm && (
                <span className="inline-flex items-center text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                  Recherche: {searchTerm}
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-1 text-amber-700 hover:text-amber-900"
                  >
                    ×
                  </button>
                </span>
              )}

              {activeFilter !== "Toutes" && (
                <span className="inline-flex items-center text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                  Catégorie: {activeFilter}
                  <button
                    onClick={() => setActiveFilter("Toutes")}
                    className="ml-1 text-amber-700 hover:text-amber-900"
                  >
                    ×
                  </button>
                </span>
              )}

              {activeType !== "Tous types" && (
                <span className="inline-flex items-center text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                  Type: {activeType}
                  <button
                    onClick={() => setActiveType("Tous types")}
                    className="ml-1 text-amber-700 hover:text-amber-900"
                  >
                    ×
                  </button>
                </span>
              )}

              <button
                onClick={resetFilters}
                className="ml-auto text-xs text-amber-700 hover:text-amber-900 flex items-center"
              >
                Tout réinitialiser
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
