import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { motion } from "framer-motion";
import { MarqueData } from "@/app/utils/types";

interface BrandCardProps {
  nom: string;
  description: string;
  type: string;
  logo: string;
  mainImage: string;
  isHovered?: boolean;
  isFeatured?: boolean;
}

export default function BrandCard({
  nom,
  description,
  type,
  logo,
  mainImage,
  isHovered = false,
  isFeatured = false,
}: BrandCardProps) {
  const brandSlug = nom.toLowerCase().replace(/\s+/g, "-");

  return (
    <Link href={`/marques/${brandSlug}`} className="block h-full w-full">
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <Card className={`overflow-hidden h-full flex flex-col bg-white border-2 group relative transition-all duration-500 ${
          isFeatured
            ? "border-amber-400/50 shadow-xl hover:shadow-2xl hover:border-amber-500"
            : "border-amber-100 shadow-md hover:shadow-xl hover:border-amber-300"
        }`}>
          {isFeatured && (
            <div className="absolute top-4 right-4 z-20 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg animate-glow-pulse">
              ⭐ PHARE
            </div>
          )}
          <div className={`relative w-full overflow-hidden ${
            isFeatured ? "aspect-[16/9]" : "aspect-[4/3]"
          }`}>
          {/* Overlay de gradient adaptatif */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10 transition-all duration-500 group-hover:from-black/70"></div>

          {/* Image principale avec effet de zoom sophistiqué */}
          <div className="absolute inset-0 bg-amber-50">
            <Image
              src={mainImage}
              alt={`Image de ${nom}`}
              fill
              className="object-cover object-center transition-all duration-700 group-hover:scale-110 scale-100 brightness-[1.05] group-hover:brightness-[1.1]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={isFeatured}
            />
          </div>

          {/* Effet shimmer au hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 pointer-events-none">
            <div className="absolute inset-0 animate-shimmer"></div>
          </div>

          {/* Conteneur du logo avec effet glow */}
          <motion.div
            whileHover={{ scale: 1.15, rotate: 5 }}
            transition={{ duration: 0.3 }}
            className="absolute top-4 left-4 bg-white/95 p-2 rounded-full flex items-center justify-center h-18 w-18 shadow-xl border-2 border-amber-100 z-20 group-hover:border-amber-400 group-hover:shadow-amber-400/50 transition-all duration-300 backdrop-blur-sm"
          >
            <Image
              src={logo}
              alt={`Logo de ${nom}`}
              width={56}
              height={56}
              className="object-contain"
            />
          </motion.div>

          {/* Badge de type avec glassmorphism prononcé */}
          <div className="absolute bottom-4 left-4 z-20">
            <span className="inline-block px-4 py-2 bg-white/90 backdrop-blur-md text-xs font-bold text-amber-700 rounded-full shadow-lg border border-white/50 group-hover:bg-amber-100 group-hover:scale-105 transition-all duration-300">
              {type}
            </span>
          </div>

          {/* Effet de survol - barre de progression */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 transform origin-left transition-transform duration-500 scale-x-0 group-hover:scale-x-100 z-20"></div>
        </div>

        <CardContent className={`flex-grow bg-gradient-to-b from-amber-50/30 to-white ${
          isFeatured ? "p-6" : "p-5"
        }`}>
          <h3 className={`font-bold mb-3 text-amber-950 group-hover:text-amber-700 transition-colors duration-300 ${
            isFeatured ? "text-2xl" : "text-lg"
          }`}>
            {nom}
          </h3>
          <p className={`text-amber-900/80 leading-relaxed ${
            isFeatured ? "text-base line-clamp-4" : "text-sm line-clamp-3"
          }`}>
            {description}
          </p>
        </CardContent>

        <CardFooter className={`${isFeatured ? "p-6" : "p-5"} pt-0`}>
          <span className="text-sm text-amber-700 group-hover:text-amber-900 font-semibold flex items-center transition-all duration-300 group">
            <span className="border-b-2 border-transparent group-hover:border-amber-500 transition-all duration-300">
              En savoir plus
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </CardFooter>
      </Card>
    </motion.div>
    </Link>
  );
}
