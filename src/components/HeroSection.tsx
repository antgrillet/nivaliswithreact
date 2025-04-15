import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <div className="relative h-screen overflow-hidden">
      {/* Image d'arrière-plan avec overlay */}
      <Image
        src="/img/acceuil.jpeg"
        alt="Image d'accueil"
        fill
        className="object-cover brightness-[0.85] scale-105 animate-slow-zoom"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-amber-950/60 via-amber-900/40 to-amber-950/60" />

      {/* Éléments décoratifs */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/40 to-transparent"></div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-amber-200/20 rounded-full"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-amber-200/15 rounded-full"></div>

      {/* Pattern overlay - points using radial gradient */}
      <div className="absolute inset-0 opacity-10 mix-blend-overlay pattern-dots"></div>

      {/* Contenu principal */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
        <div className="max-w-4xl text-center hero-text z-10 px-4 sm:px-6 lg:px-8">
          <div className="inline-block mb-4 opacity-90">
            <span className="px-3 py-1 border border-amber-300/60 text-amber-100 rounded-full text-xs uppercase tracking-wider font-medium animate-fadeIn">
              Tradition française depuis 1817
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 drop-shadow-md tracking-tight animate-fadeSlideUp">
            Découvrez l'excellence <br className="hidden md:block" />
            <span className="text-amber-200">d'Arpin</span>
          </h1>

          <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto drop-shadow leading-relaxed text-amber-50/90 animate-fadeSlideUp animation-delay-300">
            Un savoir-faire traditionnel français perpétué au fil des
            générations.
            <br className="hidden md:block" />
            Tissus de laine et confections artisanales de qualité
            exceptionnelle.
          </p>

          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto drop-shadow leading-relaxed text-amber-200 font-medium animate-fadeSlideUp animation-delay-400">
            Arpin et{" "}
            <span className="underline decoration-1 underline-offset-4">
              plusieurs autres marques prestigieuses
            </span>{" "}
            disponibles en boutique.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center mb-8 animate-fadeSlideUp animation-delay-500">
            <Link href="/marques/arpin">
              <Button className="bg-amber-700 hover:bg-amber-800 text-amber-50 px-7 py-3 text-base font-medium border-2 border-amber-600/80 shadow-xl transition-all duration-300 hover:scale-105 rounded-full">
                Découvrir Arpin
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                className="border-2 border-amber-300 text-amber-50 bg-amber-800/60 hover:bg-amber-700 px-7 py-3 text-base font-medium shadow-xl transition-all duration-300 hover:scale-105 rounded-full"
              >
                Nous contacter
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Indicateur de défilement */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce animation-duration-2000 opacity-80 z-10">
        <span className="text-amber-100 text-sm mb-2 tracking-wider font-light">
          Découvrir
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 text-amber-200"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
          />
        </svg>
      </div>
    </div>
  );
}
