import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface ImageGalleryProps {
  images: string[];
  marqueNom: string;
}

export default function ImageGallery({ images, marqueNom }: ImageGalleryProps) {
  const [fullscreen, setFullscreen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  // Fonction pour ouvrir le mode plein écran
  const openFullscreen = (index: number) => {
    setSelectedImage(index);
    setFullscreen(true);
  };

  // Navigation dans le mode plein écran
  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <section className="py-16 bg-amber-50/30">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-amber-900 mb-8 text-center">
          Collection {marqueNom}
        </h2>

        {/* Grille d'images avec animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {images.map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group relative aspect-square rounded-lg overflow-hidden shadow-md cursor-pointer"
              onClick={() => openFullscreen(index)}
            >
              <Image
                src={img}
                alt={`Image ${index + 1} de ${marqueNom}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-3 left-3 text-white text-sm font-medium">
                  {index + 1}/{images.length}
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

        {/* Bouton pour voir toutes les images si plus de 6 */}
        {images.length > 6 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setFullscreen(true)}
              className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg transition-colors shadow-sm"
            >
              Voir toutes les images ({images.length})
            </button>
          </div>
        )}

        {/* Mode plein écran */}
        {fullscreen && (
          <div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            onClick={() => setFullscreen(false)}
          >
            <div className="relative h-full w-full p-10 flex items-center justify-center">
              <Image
                src={images[selectedImage]}
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

              {/* Miniatures en bas */}
              <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                <div className="bg-black/60 p-2 rounded-md flex space-x-2 overflow-x-auto max-w-screen-lg">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className={`relative h-16 w-16 rounded-md overflow-hidden cursor-pointer border transition-transform ${
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
                {selectedImage + 1} / {images.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
