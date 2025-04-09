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
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col bg-white border border-amber-100 hover:border-amber-300 hover:scale-[1.02]">
        <div className="relative h-48 w-full">
          <Image
            src={mainImage}
            alt={`Image de ${nom}`}
            fill
            className="object-cover"
          />
          <div className="absolute top-2 left-2 bg-white p-2 rounded-full flex items-center justify-center h-12 w-12 shadow-md border border-amber-100">
            <Image
              src={logo}
              alt={`Logo de ${nom}`}
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
        </div>
        <CardContent className="p-4 flex-grow bg-gradient-to-b from-amber-50/50 to-white">
          <h3 className="text-lg font-bold">{nom}</h3>
          <p className="text-xs text-amber-700 mb-2">{type}</p>
          <p className="text-sm line-clamp-3 text-amber-800">{description}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <span className="text-sm text-amber-700 hover:text-amber-900 hover:underline font-medium">
            En savoir plus
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
