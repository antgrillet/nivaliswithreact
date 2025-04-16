"use client";

import { motion } from "framer-motion";

export default function MarquesHeader() {
  return (
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
            Découvrez notre sélection exclusive de marques de qualité, choisies
            avec soin pour leur excellence, leur authenticité et leur
            engagement.
          </motion.p>
        </div>
      </div>
    </motion.section>
  );
}
