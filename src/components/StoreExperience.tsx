import React from "react";
import { motion } from "framer-motion";

interface Testimonial {
  name: string;
  role: string;
  text: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    name: "Sophie M.",
    role: "Skipeuse passionnée",
    text: "Une superbe boutique avec un accueil chaleureux. L'équipe m'a conseillé parfaitement pour mes vêtements de ski. Je recommande vivement !",
    rating: 5,
  },
  {
    name: "Thomas L.",
    role: "Randonneur",
    text: "J'ai trouvé exactement ce qu'il me fallait pour mes randonnées. Le service est impeccable et les conseils sont toujours pertinents.",
    rating: 5,
  },
  {
    name: "Emma D.",
    role: "Famille",
    text: "Parfait pour toute la famille ! Les enfants ont adoré choisir leurs vêtements et l'équipe a été très patiente avec nous.",
    rating: 5,
  },
];

export default function StoreExperience() {
  return (
    <section className="py-16 md:py-32 bg-gradient-to-b from-amber-50 via-white to-amber-50">
      <div className="container mx-auto px-4">
        {/* Témoignages améliorés */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 md:mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-amber-950 mb-4 md:mb-6">
              Ce que disent nos clients
            </h2>
            <p className="text-lg md:text-xl text-amber-900/80 max-w-2xl mx-auto">
              Découvrez les avis de nos clients satisfaits
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group"
              >
                <div className="bg-white p-5 md:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-amber-100 hover:border-amber-300 relative overflow-hidden h-full">
                  <div className="absolute top-0 right-0 text-amber-200 text-6xl md:text-8xl font-serif leading-none opacity-20 group-hover:opacity-30 transition-opacity duration-300" aria-hidden="true">
                    "
                  </div>

                  <div className="flex items-center mb-4 md:mb-6 relative z-10">
                    <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden mr-3 md:mr-4 ring-2 ring-amber-200 group-hover:ring-amber-400 transition-all duration-300">
                      <div className="w-full h-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-xl md:text-2xl font-bold">
                        {testimonial.name.charAt(0)}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-base md:text-lg text-amber-950">{testimonial.name}</h3>
                      <p className="text-xs md:text-sm text-amber-700 font-medium">{testimonial.role}</p>
                    </div>
                  </div>

                  <div
                    className="flex mb-3 md:mb-4"
                    role="img"
                    aria-label={`Note: ${testimonial.rating} étoiles sur 5`}
                  >
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 md:w-5 md:h-5 ${i < testimonial.rating ? 'text-amber-500' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  <p className="text-amber-900/90 leading-relaxed italic relative z-10 text-sm md:text-base">
                    "{testimonial.text}"
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
