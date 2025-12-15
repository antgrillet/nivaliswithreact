"use client";

import { motion } from "framer-motion";

export default function MarquesHeader() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative pt-28 pb-20 bg-gradient-to-b from-amber-100/70 via-amber-50/50 to-white overflow-hidden"
    >
      {/* Éléments décoratifs améliorés */}
      <div className="absolute inset-0 opacity-5 pattern-dots"></div>
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-amber-200/30 to-transparent -skew-x-12 transform -translate-x-20"
      />
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-gradient-to-r from-amber-100/30 to-transparent skew-x-12 transform translate-x-10"
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold mb-6 text-amber-950 drop-shadow-sm"
          >
            Nos marques partenaires
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg md:text-xl text-amber-900/90 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Découvrez notre sélection exclusive de marques de qualité, choisies
            avec soin pour leur excellence, leur authenticité et leur
            engagement.
          </motion.p>

          {/* Indicateur de scroll subtil */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-amber-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
