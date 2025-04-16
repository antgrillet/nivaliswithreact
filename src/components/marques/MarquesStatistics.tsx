"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { MarquesData } from "@/app/utils/types";

interface MarquesStatisticsProps {
  marquesData: MarquesData;
}

export default function MarquesStatistics({
  marquesData,
}: MarquesStatisticsProps) {
  // Calcul optimisé des statistiques
  const stats = useMemo(() => {
    const allTypes = [
      ...new Set(marquesData.marques.map((marque) => marque.type)),
    ];
    const allTags = [
      ...new Set(marquesData.marques.flatMap((marque) => marque.tags)),
    ];

    // Calculer les marques les plus populaires en fonction du nombre de tags
    const popularMarques = [...marquesData.marques]
      .sort((a, b) => b.tags.length - a.tags.length)
      .slice(0, 3)
      .map((m) => m.nom);

    return {
      totalMarques: marquesData.marques.length,
      categoriesCount: allTypes.length,
      tagsCount: allTags.length,
      popularMarques,
    };
  }, [marquesData]);

  return (
    <section className="py-16 bg-amber-100/40 border-t border-amber-200">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-3xl font-bold text-center text-amber-900 mb-10"
        >
          Notre catalogue en chiffres
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white p-8 rounded-xl shadow-md text-center group hover:shadow-lg hover:bg-amber-50 transition-all duration-300"
          >
            <div className="text-4xl font-bold text-amber-700 mb-2 group-hover:scale-110 transition-transform duration-300">
              {stats.totalMarques}
            </div>
            <p className="text-amber-900">Marques partenaires</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white p-8 rounded-xl shadow-md text-center group hover:shadow-lg hover:bg-amber-50 transition-all duration-300"
          >
            <div className="text-4xl font-bold text-amber-700 mb-2 group-hover:scale-110 transition-transform duration-300">
              {stats.categoriesCount}
            </div>
            <p className="text-amber-900">Catégories différentes</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white p-8 rounded-xl shadow-md text-center group hover:shadow-lg hover:bg-amber-50 transition-all duration-300"
          >
            <div className="text-4xl font-bold text-amber-700 mb-2 group-hover:scale-110 transition-transform duration-300">
              100%
            </div>
            <p className="text-amber-900">Satisfaction client</p>
          </motion.div>
        </div>

        {/* Informations supplémentaires */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 bg-white p-6 rounded-xl shadow-md"
        >
          <h3 className="text-xl font-semibold text-amber-900 mb-4">
            Le saviez-vous ?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-amber-100 p-2 text-amber-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 018-2.828A4.5 4.5 0 0118 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 01-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 01-.69.001l-.002-.001z" />
                </svg>
              </div>
              <div>
                <p className="text-amber-800">
                  Notre marque la plus populaire est{" "}
                  <span className="font-semibold">
                    {stats.popularMarques[0]}
                  </span>
                  , suivie de près par {stats.popularMarques[1]} et{" "}
                  {stats.popularMarques[2]}.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-amber-100 p-2 text-amber-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M15.98 1.804a1 1 0 00-1.96 0l-.24 1.192a1 1 0 01-.784.785l-1.192.238a1 1 0 000 1.962l1.192.238a1 1 0 01.785.785l.238 1.192a1 1 0 001.962 0l.238-1.192a1 1 0 01.785-.785l1.192-.238a1 1 0 000-1.962l-1.192-.238a1 1 0 01-.785-.785l-.238-1.192zM6.949 5.684a1 1 0 00-1.898 0l-.683 2.051a1 1 0 01-.633.633l-2.051.683a1 1 0 000 1.898l2.051.684a1 1 0 01.633.632l.683 2.051a1 1 0 001.898 0l.683-2.051a1 1 0 01.633-.633l2.051-.683a1 1 0 000-1.898l-2.051-.683a1 1 0 01-.633-.633L6.95 5.684z" />
                </svg>
              </div>
              <div>
                <p className="text-amber-800">
                  Notre catalogue compte{" "}
                  <span className="font-semibold">
                    {stats.tagsCount} étiquettes
                  </span>{" "}
                  différentes pour vous aider à trouver exactement ce que vous
                  recherchez.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
