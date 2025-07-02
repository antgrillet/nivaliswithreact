import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Sophie M.",
    role: "Skipeuse passionnée",
    text: "Une superbe boutique avec un accueil chaleureux. L'équipe m'a conseillé parfaitement pour mes vêtements de ski. Je recommande vivement !",
    image: "/img/testimonials/sophie.jpg",
  },
  {
    name: "Thomas L.",
    role: "Randonneur",
    text: "J'ai trouvé exactement ce qu'il me fallait pour mes randonnées. Le service est impeccable et les conseils sont toujours pertinents.",
    image: "/img/testimonials/thomas.jpg",
  },
  {
    name: "Emma D.",
    role: "Famille",
    text: "Parfait pour toute la famille ! Les enfants ont adoré choisir leurs vêtements et l'équipe a été très patiente avec nous.",
    image: "/img/testimonials/emma.jpg",
  },
];

const storePhotos = [
  "/img/store/interior1.jpg",
  "/img/store/interior2.jpg",
  "/img/store/interior3.jpg",
  "/img/store/interior4.jpg",
];

export default function StoreExperience() {
  return (
    <section className="py-24 bg-amber-50">
      <div className="container mx-auto px-4">
        {/* Photos de la boutique */}
        {/* <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-8">
            Notre boutique
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {storePhotos.map((photo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative h-64 rounded-lg overflow-hidden shadow-lg"
              >
                <Image
                  src={photo}
                  alt={`Intérieur de la boutique Nivalis ${index + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </motion.div>
            ))}
          </div>
        </div> */}

        {/* Témoignages */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-8">
            Ce que disent nos clients
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <div className="flex items-center mb-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700">{testimonial.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
