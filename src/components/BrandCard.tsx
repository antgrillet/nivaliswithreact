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
}

export default function BrandCard({
  nom,
  description,
  type,
  logo,
  mainImage,
  isHovered = false,
}: BrandCardProps) {
  // Générer un slug à partir du nom de la marque
  const brandSlug = nom.toLowerCase().replace(/\s+/g, "-");

  return (
    <Link href={`/marques/${brandSlug}`} className="block h-full w-full">
      <Card className="overflow-hidden transition-all duration-500 h-full flex flex-col bg-white border border-amber-100 hover:border-amber-300 group relative shadow-sm hover:shadow-xl">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          {/* Overlay de gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-black/5 z-10 transition-opacity duration-500 group-hover:opacity-70"></div>

          {/* Image principale avec effet de zoom */}
          <div className="absolute inset-0 bg-amber-50">
            <Image
              src={mainImage}
              alt={`Image de ${nom}`}
              fill
              className={`object-cover object-center transition-transform duration-700 ${
                isHovered ? "scale-110" : "scale-105"
              } brightness-[1.05]`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
            />
          </div>

          {/* Conteneur du logo avec effet d'élévation */}
          <div
            className={`absolute top-3 left-3 bg-white p-1.5 rounded-full flex items-center justify-center h-16 w-16 shadow-md border border-amber-100 z-20 transition-all duration-500 ${
              isHovered ? "scale-110 shadow-lg" : ""
            }`}
          >
            <Image
              src={logo}
              alt={`Logo de ${nom}`}
              width={48}
              height={48}
              className="object-contain"
            />
          </div>

          {/* Badge de type avec effet glassmorphism */}
          <div className="absolute bottom-3 left-3 z-10">
            <span className="inline-block px-3 py-1.5 bg-amber-100/80 backdrop-blur-sm text-xs font-medium text-amber-500 rounded-full glassmorphism">
              {type}
            </span>
          </div>

          {/* Effet de survol - ligne d'accent */}
          <div
            className={`absolute bottom-0 left-0 w-full h-1 bg-amber-500 transform transition-transform duration-500 ${
              isHovered ? "scale-x-100" : "scale-x-0"
            }`}
          ></div>
        </div>

        <CardContent className="p-5 flex-grow bg-gradient-to-b from-amber-50/50 to-white">
          <h3 className="text-lg font-bold mb-2 text-amber-900 group-hover:text-amber-700 transition-colors duration-300">
            {nom}
          </h3>
          <p className="text-sm line-clamp-3 text-amber-800/90">
            {description}
          </p>
        </CardContent>

        <CardFooter className="p-5 pt-0">
          <span className="text-sm text-amber-700 group-hover:text-amber-900 font-medium flex items-center transition-all duration-300">
            <span
              className={`border-b border-transparent ${
                isHovered ? "border-amber-500" : ""
              } transition-all duration-300`}
            >
              En savoir plus
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ml-1 transition-transform duration-300 ${
                isHovered ? "translate-x-1.5" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
