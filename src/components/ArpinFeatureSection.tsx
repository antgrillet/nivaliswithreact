import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ArpinFeatureSection() {
  return (
    <section className="py-20 overflow-hidden bg-gradient-to-b from-amber-50 to-amber-100/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Images gallery */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden rounded-xl shadow-xl">
              <Image
                src="/img/Arpin/image4.jpeg"
                alt="Collection Arpin"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-amber-900/60 to-transparent"></div>
              <div className="absolute left-4 bottom-4 right-4">
                <span className="inline-block bg-amber-100 text-amber-900 text-xs px-3 py-1 rounded-full font-medium mb-2">
                  Heritage depuis 1817
                </span>
                <h3 className="text-white font-serif text-2xl mb-1">
                  La tradition à l'état pur
                </h3>
                <p className="text-amber-100 text-sm">
                  Tissus artisanaux produits dans les Alpes
                </p>
              </div>
            </div>

            <div className="absolute -bottom-8 -right-8 md:bottom-auto md:right-auto md:top-32 md:-left-6 lg:-left-8 w-40 h-40 md:w-44 md:h-44 lg:w-48 lg:h-48 rounded-lg shadow-lg overflow-hidden border-4 border-white transform rotate-3 md:-rotate-6">
              <Image
                src="/img/Arpin/image003.jpg"
                alt="Artisanat Arpin"
                fill
                className="object-cover"
              />
            </div>

            <div className="hidden md:block absolute -bottom-10 right-10 w-32 h-32 lg:w-36 lg:h-36 rounded-lg shadow-lg overflow-hidden border-4 border-white transform -rotate-3">
              <Image
                src="/img/Arpin/IMG_0253.jpg"
                alt="Détail textile Arpin"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Text content */}
          <div className="w-full lg:w-1/2 lg:pr-8 relative">
            <div className="max-w-lg">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                Découvrez l'excellence d'Arpin, un savoir-faire inégalé depuis
                1817
              </h2>

              <p className="text-amber-900/80 mb-6 leading-relaxed">
                Fondée en 1817, la maison Arpin perpétue l'art ancestral du
                tissage de la laine dans son atelier historique de Séez, en
                Savoie. Chaque pièce témoigne d'un patrimoine vivant, façonné
                par des artisans passionnés qui transforment la laine brute en
                textiles d'exception.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-amber-200 text-amber-900 mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-amber-800">
                    Tissus fabriqués exclusivement avec des laines naturelles
                    sélectionnées
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-amber-200 text-amber-900 mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-amber-800">
                    Technique de tissage traditionnelle préservée depuis plus de
                    200 ans
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-amber-200 text-amber-900 mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-amber-800">
                    Collections alliant héritage et modernité pour votre
                    intérieur
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/marques/arpin">
                  <Button className="bg-amber-800 hover:bg-amber-900 text-amber-50 px-6 py-3 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg border border-amber-700 w-full sm:w-auto">
                    Découvrir la collection
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    variant="outline"
                    className="border-amber-700 text-amber-800 hover:bg-amber-800/10 px-6 py-3 rounded-lg transition-all duration-300 w-full sm:w-auto"
                  >
                    Nous contacter
                  </Button>
                </Link>
              </div>

              <div className="mt-8 flex items-center text-amber-800">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 mr-2"
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
                <span className="text-sm font-medium">
                  Venez découvrir nos produits en boutique -{" "}
                  <span className="underline">
                    123 Avenue de la Mode, 75001 Paris
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
    </section>
  );
}
