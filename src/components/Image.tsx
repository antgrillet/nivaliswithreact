import { useState, useEffect } from "react";
import NextImage from "next/image";
import { encodeImageUrl } from "@/utils/imageUtils";

interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  fill?: boolean;
  sizes?: string;
}

// Cache pour les images
const imageCache = new Map<string, { url: string; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export default function Image({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 75,
  fill = false,
  sizes,
}: ImageProps) {
  const [imageUrl, setImageUrl] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      try {
        // Vérifier le cache
        const cached = imageCache.get(src);
        const now = Date.now();

        if (cached && now - cached.timestamp < CACHE_DURATION) {
          setImageUrl(cached.url);
          setIsLoading(false);
          return;
        }

        // Encoder correctement l'URL pour gérer les espaces et caractères spéciaux
        const processedSrc = encodeImageUrl(src);
        console.log(`Traitement de l'URL d'image: ${src} → ${processedSrc}`);

        // Ajouter un timestamp pour éviter le cache du navigateur
        const url = `${processedSrc}${
          processedSrc.includes("?") ? "&" : "?"
        }_t=${now}`;

        // Vérifier si l'image existe
        const response = await fetch(url, { method: "HEAD" });
        if (!response.ok) {
          throw new Error("Image non trouvée");
        }

        // Mettre en cache
        imageCache.set(src, {
          url: processedSrc,
          timestamp: now,
        });

        setImageUrl(processedSrc);
      } catch (err) {
        console.error("Erreur de chargement de l'image:", err);
        setError("Impossible de charger l'image");
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();
  }, [src]);

  if (error) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-gray-100`}
      >
        <span className="text-gray-500">Image non disponible</span>
      </div>
    );
  }

  return (
    <NextImage
      src={imageUrl}
      alt={alt}
      width={width}
      height={height}
      className={`${className} ${
        isLoading ? "opacity-0" : "opacity-100"
      } transition-opacity duration-300`}
      priority={priority}
      quality={quality}
      fill={fill}
      sizes={sizes}
    />
  );
}
