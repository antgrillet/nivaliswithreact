import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface BrandCardProps {
  nom: string;
  description: string;
  type: string;
  logo: string;
  mainImage: string;
}

export default function BrandCard({
  nom,
  description,
  type,
  logo,
  mainImage,
}: BrandCardProps) {
  return (
    <Link href={`/marques/${nom.toLowerCase().replace(/\s+/g, "-")}`}>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col bg-white border border-amber-100 hover:border-amber-300 hover:scale-[1.02] group">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-black/5 z-10"></div>
          <Image
            src={mainImage}
            alt={`Image de ${nom}`}
            fill
            className="object-cover object-center transition-transform duration-700 group-hover:scale-110 brightness-[1.05]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
          <div className="absolute top-3 left-3 bg-white p-1.5 rounded-full flex items-center justify-center h-14 w-14 shadow-md border border-amber-100 z-20 group-hover:scale-105 transition-transform">
            <Image
              src={logo}
              alt={`Logo de ${nom}`}
              width={45}
              height={45}
              className="object-contain"
            />
          </div>
          <div className="absolute bottom-0 left-0 w-full p-3 z-10">
            <span className="inline-block px-2.5 py-1 bg-amber-100/80 backdrop-blur-sm text-xs font-medium text-amber-900 rounded-full">
              {type}
            </span>
          </div>
        </div>
        <CardContent className="p-5 flex-grow bg-gradient-to-b from-amber-50/50 to-white">
          <h3 className="text-lg font-bold mb-2 text-amber-900">{nom}</h3>
          <p className="text-sm line-clamp-3 text-amber-800/90">
            {description}
          </p>
        </CardContent>
        <CardFooter className="p-5 pt-0">
          <span className="text-sm text-amber-700 group-hover:text-amber-900 group-hover:underline font-medium flex items-center">
            En savoir plus
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform"
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
