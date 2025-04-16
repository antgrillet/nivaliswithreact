import { useState, useEffect, useCallback } from "react";
import Image from "./Image";
import { motion } from "framer-motion";

interface ImageGalleryProps {
  // Uniquement le chemin du dossier d'images
  imageFolderPath: string;
  marqueNom: string;
}

// Type pour les entrées dans le cache
interface CacheEntry {
  images: string[];
  timestamp: number;
}

// Cache d'images simple pour éviter de recharger les mêmes données à chaque fois
const imageCache: Record<string, CacheEntry> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export default function ImageGallery({
  imageFolderPath,
  marqueNom,
}: ImageGalleryProps) {
  const [fullscreen, setFullscreen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const imagesPerPage = 12; // Nombre d'images par page

  useEffect(() => {
    // Fonction pour charger les images depuis le dossier
    const loadImagesFromFolder = async () => {
      try {
        // Vérifie si les données sont dans le cache et si elles sont encore valides
        const cachedData = imageCache[imageFolderPath];
        const now = Date.now();

        if (
          cachedData &&
          cachedData.images.length > 0 &&
          now - cachedData.timestamp < CACHE_DURATION
        ) {
          console.log("Utilisation des images en cache");
          setGalleryImages(cachedData.images);
          setIsLoading(false);
          return;
        }

        // Si les données ne sont pas dans le cache ou sont expirées, on fait une requête
        setIsLoading(true);
        const response = await fetch(`/api/images?folder=${imageFolderPath}`);

        if (!response.ok) {
          throw new Error(
            `Erreur lors du chargement des images : ${response.status}`
          );
        }

        const data = await response.json();
        // Tri des images par nom pour une présentation cohérente
        const sortedImages = data.images.sort();

        // Mise à jour du cache
        imageCache[imageFolderPath] = {
          images: sortedImages,
          timestamp: now,
        };

        setGalleryImages(sortedImages);
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des images:", error);
        setError(
          "Impossible de charger les images. Veuillez réessayer plus tard."
        );
        setIsLoading(false);
      }
    };

    loadImagesFromFolder();
  }, [imageFolderPath]);

  // Fonction pour ouvrir l'image en plein écran
  const openFullscreen = (index: number) => {
    setSelectedImage(index);
    setFullscreen(true);
  };

  // Navigation entre les images en mode plein écran
  const nextImage = useCallback(() => {
    setSelectedImage((prev) => (prev + 1) % galleryImages.length);
  }, [galleryImages.length]);

  const prevImage = useCallback(() => {
    setSelectedImage(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
    );
  }, [galleryImages.length]);

  // Gestion des touches du clavier en mode plein écran
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!fullscreen) return;

      switch (e.key) {
        case "ArrowRight":
          nextImage();
          break;
        case "ArrowLeft":
          prevImage();
          break;
        case "Escape":
          setFullscreen(false);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fullscreen, nextImage, prevImage]);

  // Calcul pour la pagination
  const totalPages = Math.ceil(galleryImages.length / imagesPerPage);
  const currentImages = galleryImages.slice(
    (currentPage - 1) * imagesPerPage,
    currentPage * imagesPerPage
  );

  // Changement de page
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  // On affiche un message de chargement si les images sont en cours de chargement
  if (isLoading) {
    return (
      <section className="py-16 bg-amber-50/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-amber-900 mb-8">
            Collection {marqueNom}
          </h2>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <p className="text-amber-800">Chargement des images...</p>
          </div>
        </div>
      </section>
    );
  }

  // On affiche un message d'erreur si le chargement a échoué
  if (error) {
    return (
      <section className="py-16 bg-amber-50/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-amber-900 mb-8">
            Collection {marqueNom}
          </h2>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <p className="text-amber-800">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg transition-colors shadow-sm"
            >
              Réessayer
            </button>
          </div>
        </div>
      </section>
    );
  }

  // On affiche un message si aucune image n'est disponible
  if (galleryImages.length === 0) {
    return (
      <section className="py-16 bg-amber-50/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-amber-900 mb-8">
            Collection {marqueNom}
          </h2>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <p className="text-amber-800">
              Aucune image disponible pour le moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-amber-50/30">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-amber-900 mb-8 text-center">
          Collection {marqueNom}
        </h2>

        {/* Grille d'images avec animation - affiche toutes les images de la page courante */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentImages.map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }} // Délai réduit pour ne pas attendre trop longtemps
              className="group relative aspect-square rounded-lg overflow-hidden shadow-md cursor-pointer"
              onClick={() =>
                openFullscreen((currentPage - 1) * imagesPerPage + index)
              }
            >
              <Image
                src={img}
                alt={`Image ${
                  (currentPage - 1) * imagesPerPage + index + 1
                } de ${marqueNom}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                priority={index < 4}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-3 left-3 text-white text-sm font-medium">
                  {(currentPage - 1) * imagesPerPage + index + 1}/
                  {galleryImages.length}
                </div>
                <div className="absolute bottom-3 right-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination pour naviguer entre les pages d'images */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            <button
              onClick={() => goToPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${
                currentPage === 1
                  ? "bg-amber-100 text-amber-400 cursor-not-allowed"
                  : "bg-amber-100 hover:bg-amber-200 text-amber-800"
              }`}
            >
              &larr;
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i + 1)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === i + 1
                    ? "bg-amber-500 text-white"
                    : "bg-amber-100 hover:bg-amber-200 text-amber-800"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md ${
                currentPage === totalPages
                  ? "bg-amber-100 text-amber-400 cursor-not-allowed"
                  : "bg-amber-100 hover:bg-amber-200 text-amber-800"
              }`}
            >
              &rarr;
            </button>
          </div>
        )}

        {/* Bouton pour voir toutes les images en plein écran */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => {
              setSelectedImage(0);
              setFullscreen(true);
            }}
            className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg transition-colors shadow-sm"
          >
            Voir toutes les images ({galleryImages.length})
          </button>
        </div>

        {/* Mode plein écran - permet de parcourir toutes les images */}
        {fullscreen && (
          <div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            onClick={() => setFullscreen(false)}
          >
            <div className="relative h-full w-full p-10 flex items-center justify-center">
              <Image
                src={galleryImages[selectedImage]}
                alt={`Image ${selectedImage + 1} de ${marqueNom}`}
                fill
                className="object-contain"
                priority
              />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full"
                aria-label="Image précédente"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full"
                aria-label="Image suivante"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>

              <button
                onClick={() => setFullscreen(false)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 p-3 rounded-md"
                aria-label="Fermer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Miniatures en bas avec défilement horizontal */}
              <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                <div className="bg-black/60 p-2 rounded-md flex space-x-2 overflow-x-auto max-w-screen-lg snap-x">
                  {galleryImages.map((img, index) => (
                    <div
                      key={index}
                      className={`relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden cursor-pointer border transition-transform snap-start ${
                        index === selectedImage
                          ? "border-amber-500 scale-105"
                          : "border-transparent opacity-50 hover:opacity-100"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(index);
                      }}
                    >
                      <Image
                        src={img}
                        alt={`Miniature ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute top-4 left-4 bg-black/40 px-3 py-1 rounded-md text-white text-sm">
                {selectedImage + 1} / {galleryImages.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
