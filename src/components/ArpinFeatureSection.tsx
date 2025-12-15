"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { getImageUrl } from "@/utils/imageUtils";

export default function ArpinFeatureSection() {
  return (
    <section className="py-12 md:py-20 overflow-hidden bg-gradient-to-b from-amber-50 to-amber-100/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Images gallery */}
          <motion.div
            className="w-full lg:w-1/2 relative pb-12 md:pb-16 lg:pb-0"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full overflow-hidden rounded-xl shadow-xl">
              <Image
                src={getImageUrl("/img/Arpin/image4.jpeg")}
                alt="Collection de tissus Arpin exposée en boutique"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-amber-900/60 to-transparent"></div>
              <div className="absolute left-4 bottom-4 right-4">
                <span className="inline-block bg-amber-100 text-amber-900 text-xs px-3 py-1 rounded-full font-medium mb-2">
                  Heritage depuis 1817
                </span>
                <h3 className="text-white font-serif text-xl md:text-2xl mb-1">
                  La tradition à l'état pur
                </h3>
                <p className="text-amber-100 text-sm">
                  Tissus artisanaux produits dans les Alpes
                </p>
              </div>
            </div>

            {/* Image flottante - position adaptée pour éviter chevauchement sur tablet */}
            <motion.div
              className="absolute -bottom-6 right-4 md:-bottom-8 md:right-auto md:left-4 lg:top-32 lg:-left-8 lg:bottom-auto w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-lg shadow-lg overflow-hidden border-4 border-white transform rotate-3 lg:-rotate-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.1, rotate: -3 }}
            >
              <Image
                src={getImageUrl("/img/Arpin/image003.jpg")}
                alt="Artisan travaillant la laine dans l'atelier Arpin"
                fill
                className="object-cover"
                loading="lazy"
              />
            </motion.div>

            {/* Seconde image flottante - cachée sur mobile/tablet, visible desktop */}
            <motion.div
              className="hidden lg:block absolute -bottom-10 right-10 w-36 h-36 rounded-lg shadow-lg overflow-hidden border-4 border-white transform -rotate-3"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ scale: 1.1, rotate: 3 }}
            >
              <Image
                src={getImageUrl("/img/Arpin/IMG_0253.jpg")}
                alt="Détail d'un textile Arpin tissé à la main"
                fill
                className="object-cover"
                loading="lazy"
              />
            </motion.div>
          </motion.div>

          {/* Text content */}
          <motion.div
            className="w-full lg:w-1/2 lg:pr-8 relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="max-w-lg mx-auto lg:mx-0">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 leading-tight">
                Découvrez l'excellence d'Arpin, un savoir-faire inégalé depuis
                1817
              </h2>

              <p className="text-amber-900/80 mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
                Fondée en 1817, la maison Arpin perpétue l'art ancestral du
                tissage de la laine dans son atelier historique de Séez, en
                Savoie. Chaque pièce témoigne d'un patrimoine vivant, façonné
                par des artisans passionnés qui transforment la laine brute en
                textiles d'exception.
              </p>

              <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-amber-200 text-amber-900 mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-amber-800 text-sm md:text-base">
                    Tissus fabriqués exclusivement avec des laines naturelles
                    sélectionnées
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-amber-200 text-amber-900 mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-amber-800 text-sm md:text-base">
                    Technique de tissage traditionnelle préservée depuis plus de
                    200 ans
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-amber-200 text-amber-900 mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-amber-800 text-sm md:text-base">
                    Collections alliant héritage et modernité pour votre
                    intérieur
                  </span>
                </li>
              </ul>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <Link href="/marques/arpin">
                  <Button className="bg-amber-800 hover:bg-amber-900 text-amber-50 px-5 md:px-6 py-2.5 md:py-3 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg border border-amber-700 w-full sm:w-auto text-sm md:text-base">
                    Découvrir la collection
                  </Button>
                </Link>
                <a
                  href="/api/download?file=Catalogue%20sur%20Mesure%20Arpin%202022.pdf"
                  download
                  className="text-sm inline-flex items-center justify-center px-5 md:px-6 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg transition-colors border border-amber-200 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                >
                  Catalogue PDF
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-3 h-3 ml-2"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                    />
                  </svg>
                </a>
                <Link href="/contact">
                  <Button
                    variant="outline"
                    className="border-amber-700 text-amber-800 hover:bg-amber-800/10 px-5 md:px-6 py-2.5 md:py-3 rounded-lg transition-all duration-300 w-full sm:w-auto text-sm md:text-base"
                  >
                    Nous contacter
                  </Button>
                </Link>
              </div>

              <div className="mt-6 md:mt-8 flex items-center text-amber-800">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 mr-2 flex-shrink-0"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
                <span className="text-xs md:text-sm font-medium">
                  Venez découvrir nos produits en boutique -{" "}
                  <span className="underline">
                    21 Rte du Front de Neige, 74260 Les Gets
                  </span>
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent pointer-events-none" aria-hidden="true"></div>
    </section>
  );
}
