import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { MarqueData } from "@/app/utils/types";
import { getImageUrl } from "@/utils/imageUtils";

interface HeroContent {
  subtitle: string;
  description: string;
}

interface HeroSectionProps {
  brands?: MarqueData[];
}

export default function HeroSection({ brands }: HeroSectionProps) {
  const [currentBrand, setCurrentBrand] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [marques, setMarques] = useState<MarqueData[]>(brands ?? []);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const [content, setContent] = useState<HeroContent>({
    subtitle: "Multi-marques",
    description:
      "Découvrez notre sélection exclusive de marques prestigieuses, chacune choisie pour son excellence et son engagement.",
  });

  useEffect(() => {
    if (brands && Array.isArray(brands)) {
      setMarques(brands);
    }
  }, [brands]);

  // Charger les marques et le contenu depuis l'API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const contentRes = await fetch(
          "/api/cms/content?section=homepage&subsection=hero"
        );

        if (contentRes.ok) {
          const contentData = await contentRes.json();
          setContent(contentData);
        }

        if (!brands) {
          const marquesRes = await fetch("/api/cms/marques");
          if (marquesRes.ok) {
            const marquesData = await marquesRes.json();
            const list = Array.isArray(marquesData?.marques)
              ? marquesData.marques
              : [];
            setMarques(list);
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [brands]);

  // Sélection des marques phares à mettre en avant (5 max) - mémorisée
  const highlightedBrands = useMemo(() => {
    if (!marques.length) return [];
    return [
      ...marques.filter((m) => m.videos && m.videos.length > 0),
      ...marques.filter((m) => !m.videos || m.videos.length === 0).slice(0, 5),
    ].slice(0, 5);
  }, [marques]);

  // Fonction pour passer à la marque suivante - mémorisée
  const nextBrand = useCallback(() => {
    if (highlightedBrands.length === 0) return;
    setCurrentBrand((prev) => (prev + 1) % highlightedBrands.length);
  }, [highlightedBrands.length]);

  // Fonction pour passer à la marque précédente - mémorisée
  const prevBrand = useCallback(() => {
    if (highlightedBrands.length === 0) return;
    setCurrentBrand(
      (prev) => (prev - 1 + highlightedBrands.length) % highlightedBrands.length
    );
  }, [highlightedBrands.length]);

  // Mettre en pause l'autoplay lors du hover
  const pauseAutoplay = useCallback(() => setAutoplay(false), []);
  const resumeAutoplay = useCallback(() => setAutoplay(true), []);

  // Gestion des erreurs d'image
  const handleImageError = useCallback((brandName: string) => {
    setImageError((prev) => ({ ...prev, [brandName]: true }));
  }, []);

  // Gestion de l'autoplay
  useEffect(() => {
    if (autoplay && highlightedBrands.length > 1) {
      autoplayRef.current = setInterval(() => {
        nextBrand();
      }, 5000);
    }

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [autoplay, nextBrand, highlightedBrands.length]);

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

  // État de chargement avec skeleton
  if (isLoading) {
    return (
      <section className="relative h-screen overflow-hidden bg-gradient-to-br from-amber-900 to-amber-950">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
            <div className="w-full md:w-2/3 px-4 py-8 space-y-6">
              <Skeleton className="h-8 w-32 rounded-full bg-amber-800/50" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full bg-amber-800/50" />
                <Skeleton className="h-12 w-64 bg-amber-800/50" />
              </div>
              <Skeleton className="h-20 w-full max-w-2xl bg-amber-800/50" />
              <div className="flex gap-4">
                <Skeleton className="h-14 w-48 rounded-full bg-amber-800/50" />
                <Skeleton className="h-14 w-48 rounded-full bg-amber-800/50" />
              </div>
            </div>
            <div className="hidden lg:block w-1/3 px-4 space-y-4">
              <Skeleton className="h-6 w-48 bg-amber-800/50" />
              <div className="flex gap-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-14 w-14 rounded-full bg-amber-800/50" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Aucune marque disponible
  if (!currentMarque) {
    return (
      <section className="relative h-screen overflow-hidden bg-gradient-to-br from-amber-900 to-amber-950 flex items-center justify-center">
        <p className="text-amber-100 text-xl">Aucune marque disponible</p>
      </section>
    );
  }

  return (
    <section
      className="relative h-screen overflow-hidden"
      onMouseEnter={pauseAutoplay}
      onMouseLeave={resumeAutoplay}
      aria-label="Carrousel des marques phares"
      role="region"
    >
      {/* Image ou vidéo d'arrière-plan */}
      <motion.div
        key={`bg-${currentBrand}`}
        className="absolute inset-0 z-0"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={fadeVariants}
      >
        <div className="relative h-full w-full">
          {currentMarque.videos && currentMarque.videos.length > 0 ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover brightness-[0.85]"
              aria-hidden="true"
            >
              <source src={currentMarque.videos[0]} type="video/mp4" />
            </video>
          ) : imageError[currentMarque.nom] ? (
            <div className="w-full h-full bg-gradient-to-br from-amber-800 to-amber-950" />
          ) : (
            <Image
              src={getImageUrl(currentMarque.mainImage)}
              alt={`Photo principale de la marque ${currentMarque.nom} - ${currentMarque.type}`}
              fill
              className="object-cover object-center brightness-[0.85] animate-kenburns"
              priority
              onError={() => handleImageError(currentMarque.nom)}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-950/60 via-amber-900/40 to-amber-950/60" />
        </div>
      </motion.div>

      {/* Overlay décoratif avec texture noise */}
      <div className="absolute inset-0 noise-texture opacity-20 mix-blend-overlay z-10"></div>
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/30 to-transparent z-10"></div>
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/30 to-transparent z-10"></div>

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
              <div className="h-16 w-16 bg-white/95 rounded-full flex items-center justify-center mr-4 overflow-hidden animate-float shadow-lg hover:shadow-amber-400/50 transition-shadow duration-300 hover:scale-110">
                <Image
                  src={getImageUrl(currentMarque.logo)}
                  alt={`Logo de ${currentMarque.nom}`}
                  width={40}
                  height={40}
                  className="object-contain"
                  onError={() => handleImageError(`logo-${currentMarque.nom}`)}
                />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight drop-shadow-lg">
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
                <Button className="bg-amber-700 hover:bg-amber-800 text-white px-8 py-6 text-base font-semibold shadow-xl transition-all duration-300 hover:scale-105 rounded-full btn-3d relative overflow-hidden group">
                  <span className="relative z-10">Découvrir {currentMarque.nom}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Button>
              </Link>
              
              <Link href="/marques">
                <Button
                  variant="outline"
                  className="border-2 border-white/70 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:border-white px-8 py-6 text-base font-semibold shadow-xl transition-all duration-300 hover:scale-105 rounded-full"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))' }}
                >
                  Toutes nos marques
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Miniatures des autres marques */}
          <div className="hidden lg:flex flex-col gap-3 w-1/3 px-4 animate-fadeSlideUp animation-delay-500">
            <p className="text-amber-200 mb-2 font-medium" id="brand-selector-label">
              Nos autres marques phares
            </p>
            <div
              className="flex flex-wrap gap-4"
              role="tablist"
              aria-labelledby="brand-selector-label"
            >
              {highlightedBrands.map((brand, index) => (
                <button
                  key={brand?.nom || index}
                  onClick={() => setCurrentBrand(index)}
                  role="tab"
                  aria-selected={index === currentBrand}
                  aria-label={`Voir ${brand?.nom || `Marque ${index + 1}`}`}
                  className={`relative h-14 w-14 rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center hover-lift focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 ${
                    index === currentBrand
                      ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-amber-900/50 scale-110 animate-pulse-glow"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <div className="absolute inset-0 bg-white rounded-full overflow-hidden">
                    <Image
                      src={getImageUrl(brand?.logo || "/img/logo.png")}
                      alt=""
                      fill
                      className="object-contain p-2"
                      aria-hidden="true"
                    />
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 glassmorphism rounded-xl p-4">
              <h3 className="text-amber-100 font-medium text-lg mb-2">
                Nivalis - {content.subtitle}
              </h3>
              <p className="text-amber-200/80 text-sm">{content.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Indication de défilement améliorée */}
      <motion.div
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-20 cursor-pointer group"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <span className="text-amber-100 text-sm mb-2 tracking-wider font-medium backdrop-blur-md bg-amber-900/30 border border-amber-600/40 px-4 py-2 rounded-full group-hover:bg-amber-800/50 group-hover:border-amber-500/60 transition-all duration-300 shadow-lg">
          Découvrir plus
        </span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-amber-400/60 rounded-full flex items-start justify-center p-2 group-hover:border-amber-300 transition-colors duration-300 bg-amber-950/20 backdrop-blur-sm"
        >
          <motion.div
            className="w-1.5 h-1.5 bg-amber-300 rounded-full shadow-lg shadow-amber-500/50"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
