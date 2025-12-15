import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import BrandCard from "@/components/BrandCard";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MarqueData } from "@/app/utils/types";

// interface Brand {
//   nom: string;
//   description: string;
//   type: string;
//   logo: string;
//   mainImage: string;
//   tags: string[];
// }

interface BrandSectionProps {
  brands: MarqueData[];
}

// Animation variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const textVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

export default function BrandSection({ brands }: BrandSectionProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("Tous");

  // Mémorisation des tags pour éviter les recalculs
  const allTags = useMemo(
    () => ["Tous", ...new Set(brands.flatMap(brand => brand.tags || []))],
    [brands]
  );

  // Mémorisation du filtrage des marques
  const filteredBrands = useMemo(
    () => selectedFilter === "Tous"
      ? brands
      : brands.filter(brand => brand.tags?.includes(selectedFilter)),
    [brands, selectedFilter]
  );

  // Mémorisation des marques affichées
  const displayedBrands = useMemo(
    () => showAllBrands ? filteredBrands : filteredBrands.slice(0, 8),
    [filteredBrands, showAllBrands]
  );

  const featuredBrands = useMemo(() => ["The North Face", "Arpin", "UGG"], []);

  const isFeatured = useCallback(
    (brandName: string) => featuredBrands.includes(brandName),
    [featuredBrands]
  );

  // Gestion du changement de filtre
  const handleFilterChange = useCallback((tag: string) => {
    setSelectedFilter(tag);
    setShowAllBrands(false); // Réinitialiser l'affichage lors du changement de filtre
  }, []);

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Fond avec gradient et éléments décoratifs */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50/80 via-white to-amber-50/60 z-0"></div>

      {/* Élément décoratif */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-100 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-amber-200 rounded-full blur-3xl opacity-30"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={textVariants}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-amber-950 mb-4">
            Nos marques en boutique
          </h2>
          <p className="text-amber-900/80 max-w-2xl mx-auto text-lg leading-relaxed">
            Venez découvrir en magasin notre sélection exclusive des plus
            grandes marques outdoor et lifestyle. Notre équipe vous accueille
            pour vous conseiller et vous faire essayer les produits.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 md:gap-3 mb-12 md:mb-16"
          role="tablist"
          aria-label="Filtrer les marques par catégorie"
        >
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleFilterChange(tag)}
              role="tab"
              aria-selected={selectedFilter === tag}
              aria-controls="brands-grid"
              className={`px-4 md:px-6 py-2 md:py-3 rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                selectedFilter === tag
                  ? "bg-amber-700 text-white shadow-lg scale-105"
                  : "bg-white text-amber-800 hover:bg-amber-100 border-2 border-amber-200"
              }`}
            >
              {tag}
            </button>
          ))}
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          id="brands-grid"
          role="tabpanel"
          aria-label={`Marques filtrées par ${selectedFilter}`}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 auto-rows-fr"
        >
          {displayedBrands.map((brand, index) => (
            <motion.div
              key={brand.nom}
              variants={itemVariants}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`h-full ${
                isFeatured(brand.nom) ? "lg:col-span-2 lg:row-span-1" : ""
              }`}
            >
              <BrandCard
                nom={brand.nom}
                description={brand.description}
                type={brand.type}
                logo={brand.logo}
                mainImage={brand.mainImage}
                isHovered={hoveredIndex === index}
                isFeatured={isFeatured(brand.nom)}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Condition pour afficher le bouton "Voir toutes les marques" */}
        {Array.isArray(filteredBrands) && filteredBrands.length > 8 && (
          <div className="flex justify-center">
            <Button
              onClick={() => setShowAllBrands(!showAllBrands)}
              className="bg-amber-700 hover:bg-amber-800 text-white px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-3 font-semibold text-base group"
            >
              <span>
                {showAllBrands ? "Afficher moins" : "Voir toutes nos marques"}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 transition-transform duration-300 group-hover:translate-y-1 ${
                  showAllBrands ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Button>
          </div>
        )}

        {/* Section des statistiques améliorée */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 md:mt-24 bg-gradient-to-br from-white to-amber-50/30 rounded-3xl shadow-2xl border-2 border-amber-200/50 p-6 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
        >
          <motion.div
            className="text-center group"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4 group-hover:bg-amber-200 transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
            <h3 className="text-amber-950 text-4xl md:text-5xl font-bold mb-3">
              {brands.length}+
            </h3>
            <p className="text-amber-800 font-medium text-base md:text-lg">Marques disponibles en magasin</p>
          </motion.div>
          <motion.div
            className="text-center group"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4 group-hover:bg-amber-200 transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-amber-950 text-4xl md:text-5xl font-bold mb-3">50m²</h3>
            <p className="text-amber-800 font-medium text-base md:text-lg">D'espace dédié aux marques</p>
          </motion.div>
          <motion.div
            className="text-center group"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4 group-hover:bg-amber-200 transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-amber-950 text-4xl md:text-5xl font-bold mb-3">7j/7</h3>
            <p className="text-amber-800 font-medium text-base md:text-lg">Ouvert toute la semaine</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
