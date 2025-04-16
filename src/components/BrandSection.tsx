import React, { useState } from "react";
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

  // Debugging
  console.log("BrandSection: brands.length =", brands?.length);
  console.log("BrandSection: showAllBrands =", showAllBrands);

  // Limiter à 8 marques initialement
  const displayedBrands =
    showAllBrands || !Array.isArray(brands)
      ? Array.isArray(brands)
        ? brands
        : []
      : brands.slice(0, 8);

  // Debugging
  console.log(
    "BrandSection: displayedBrands.length =",
    displayedBrands?.length
  );

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
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">
            Découvrez notre sélection de marques
          </h2>
          <p className="text-amber-800/80 max-w-2xl mx-auto text-lg">
            Nous avons soigneusement sélectionné des marques qui partagent nos
            valeurs d'authenticité, de qualité et de respect de l'environnement.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12"
        >
          {displayedBrands.map((brand, index) => (
            <motion.div
              key={brand.nom}
              variants={itemVariants}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="h-full"
            >
              <BrandCard
                nom={brand.nom}
                description={brand.description}
                type={brand.type}
                logo={brand.logo}
                mainImage={brand.mainImage}
                isHovered={hoveredIndex === index}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Condition pour afficher le bouton "Voir toutes les marques" */}
        {Array.isArray(brands) && brands.length > 8 && (
          <div className="flex justify-center">
            <Button
              onClick={() => setShowAllBrands(!showAllBrands)}
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
            >
              <span>
                {showAllBrands ? "Afficher moins" : "Voir toutes les marques"}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 transition-transform duration-300 ${
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

        {/* Section des statistiques */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-24 bg-white rounded-2xl shadow-xl border border-amber-100 p-8 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="text-center">
            <h3 className="text-amber-900 text-4xl font-bold mb-2">
              {brands.length}+
            </h3>
            <p className="text-amber-700">Marques sélectionnées</p>
          </div>
          <div className="text-center">
            <h3 className="text-amber-900 text-4xl font-bold mb-2">95%</h3>
            <p className="text-amber-700">Satisfaction client</p>
          </div>
          <div className="text-center">
            <h3 className="text-amber-900 text-4xl font-bold mb-2">3.2k</h3>
            <p className="text-amber-700">Avis positifs</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
