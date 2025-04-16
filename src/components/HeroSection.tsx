import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import marqueData from "@/data/marque.json";

export default function HeroSection() {
  const [currentBrand, setCurrentBrand] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  // Sélection des marques phares à mettre en avant (5 max)
  const highlightedBrands = [
    marqueData.marques.find((m) => m.nom === "Arpin"),
    marqueData.marques.find((m) => m.nom === "The North Face"),
    marqueData.marques.find((m) => m.nom === "UGG"),
    marqueData.marques.find((m) => m.nom === "Lola espeleta"),
    marqueData.marques.find((m) => m.nom === "RH+"),
  ].filter(Boolean);

  // Fonction pour passer à la marque suivante
  const nextBrand = () => {
    setCurrentBrand((prev) => (prev + 1) % highlightedBrands.length);
  };

  // Fonction pour passer à la marque précédente
  const prevBrand = () => {
    setCurrentBrand(
      (prev) => (prev - 1 + highlightedBrands.length) % highlightedBrands.length
    );
  };

  // Mettre en pause l'autoplay lors du hover
  const pauseAutoplay = () => setAutoplay(false);
  const resumeAutoplay = () => setAutoplay(true);

  // Gestion de l'autoplay
  useEffect(() => {
    if (autoplay) {
      autoplayRef.current = setInterval(() => {
        nextBrand();
      }, 5000);
    }

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [autoplay, currentBrand]);

  // Animation pour les transitions
  const fadeVariants = {
    hidden: { opacity: 0, scale: 1.05 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.5 } },
  };

  const slideVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } },
  };

  const currentMarque = highlightedBrands[currentBrand];

  if (!currentMarque) return null;

  return (
    <section
      className="relative h-screen overflow-hidden"
      onMouseEnter={pauseAutoplay}
      onMouseLeave={resumeAutoplay}
    >
      {/* Fond décoratif */}
      <div className="absolute inset-0 bg-amber-900/20 z-0"></div>

      {/* Image d'arrière-plan avec effet de panoramique lent */}
      <motion.div
        key={`bg-${currentBrand}`}
        className="absolute inset-0 z-0"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={fadeVariants}
      >
        <div className="relative h-full w-full">
          <Image
            src={currentMarque.mainImage}
            alt={`Image de ${currentMarque.nom}`}
            fill
            className="object-cover object-center brightness-[0.75] animate-kenburns"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-950/70 via-amber-900/50 to-amber-950/70" />
        </div>
      </motion.div>

      {/* Overlay décoratif */}
      <div className="absolute inset-0 pattern-dots opacity-10 mix-blend-overlay z-10"></div>
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/40 to-transparent z-10"></div>
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/40 to-transparent z-10"></div>

      {/* Cercles décoratifs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-amber-200/10 rounded-full z-10 animate-pulse-glow"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-amber-200/15 rounded-full z-10"></div>

      {/* Contenu principal */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 z-20">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          {/* Information de la marque courante */}
          <motion.div
            key={`content-${currentBrand}`}
            className="w-full md:w-2/3 text-left px-4 py-8 md:pr-12"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={slideVariants}
          >
            <div className="mb-6">
              <span className="inline-block px-3 py-1 text-xs uppercase tracking-wider bg-amber-800/60 text-amber-100 rounded-full glassmorphism">
                {currentMarque.type}
              </span>
            </div>

            <div className="mb-4 md:mb-6 flex items-center">
              <div className="h-14 w-14 bg-white/90 rounded-full flex items-center justify-center mr-4 overflow-hidden animate-float">
                <Image
                  src={currentMarque.logo}
                  alt={`Logo ${currentMarque.nom}`}
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight text-gradient">
                {currentMarque.nom}
              </h1>
            </div>

            <p className="text-xl text-amber-100/90 mb-6 max-w-2xl leading-relaxed animate-fadeSlideUp animation-delay-300">
              {currentMarque.description}
            </p>

            <div className="flex flex-wrap gap-4 animate-fadeSlideUp animation-delay-400">
              <Link
                href={`/marques/${currentMarque.nom
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >
                <Button className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-5 text-base shadow-md transition-all duration-300 hover:scale-105 rounded-full btn-3d">
                  Découvrir {currentMarque.nom}
                </Button>
              </Link>
              <Link href="/marques">
                <Button
                  variant="outline"
                  className="border-2 border-amber-300/50 text-amber-50 bg-transparent hover:bg-amber-800/40 px-6 py-5 text-base shadow-md transition-all duration-300 hover:scale-105 rounded-full btn-3d"
                >
                  Voir toutes nos marques
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Miniatures des autres marques */}
          <div className="hidden lg:flex flex-col gap-3 w-1/3 px-4 animate-fadeSlideUp animation-delay-500">
            <p className="text-amber-200 mb-2 font-medium">
              Nos autres marques phares
            </p>
            <div className="flex flex-wrap gap-4">
              {highlightedBrands.map((brand, index) => (
                <div
                  key={brand?.nom || index}
                  onClick={() => setCurrentBrand(index)}
                  className={`relative h-14 w-14 rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center hover-lift ${
                    index === currentBrand
                      ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-amber-900/50 scale-110 animate-pulse-glow"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <div className="absolute inset-0 bg-white rounded-full overflow-hidden">
                    <Image
                      src={brand?.logo || "/img/logo.png"}
                      alt={brand?.nom || `Marque ${index + 1}`}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 glassmorphism rounded-xl p-4">
              <h3 className="text-amber-100 font-medium text-lg mb-2">
                Nivalis - Multi-marques
              </h3>
              <p className="text-amber-200/80 text-sm">
                Découvrez notre sélection exclusive de marques prestigieuses,
                chacune choisie pour son excellence et son engagement.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contrôles du carousel */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center p-6 z-30 carousel-transition">
        <div className="text-amber-200/70 text-sm">
          <span className="font-medium">{currentBrand + 1}</span> /{" "}
          {highlightedBrands.length}
        </div>

        <div className="flex gap-2">
          <button
            onClick={prevBrand}
            className="p-2 rounded-full bg-amber-800/40 hover:bg-amber-700/60 text-amber-100 transition-colors btn-3d"
            aria-label="Marque précédente"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <button
            onClick={nextBrand}
            className="p-2 rounded-full bg-amber-800/40 hover:bg-amber-700/60 text-amber-100 transition-colors btn-3d"
            aria-label="Marque suivante"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>

        <div className="flex items-center">
          <button
            onClick={() => setAutoplay(!autoplay)}
            className={`p-2 rounded-full ${
              autoplay ? "text-amber-400" : "text-amber-200/50"
            } transition-colors btn-3d`}
            aria-label={autoplay ? "Pause" : "Play"}
          >
            {autoplay ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 5.25v13.5m-7.5-13.5v13.5"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Indication de défilement */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce animation-duration-2000 opacity-80 z-10">
        <span className="text-amber-100 text-sm mb-1 tracking-wider font-light">
          Découvrir plus
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 text-amber-200"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
          />
        </svg>
      </div>
    </section>
  );
}
