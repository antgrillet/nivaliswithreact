import Link from "next/link";
import { SafeImage } from "@/components/SafeImage";
import { slugify } from "@/lib/slug";
import { cn } from "@/lib/utils";

interface BrandCardProps {
  nom: string;
  /** Nom d'affichage soigné ; le slug reste basé sur `nom`. */
  displayName?: string;
  description?: string;
  type?: string;
  logo?: string;
  mainImage?: string;
  featured?: boolean;
  className?: string;
  priority?: boolean;
}

export default function BrandCard({
  nom,
  displayName,
  type,
  mainImage,
  featured = false,
  className,
  priority = false,
}: BrandCardProps) {
  const label = displayName?.trim() || nom;
  return (
    <Link
      href={`/marques/${slugify(nom)}`}
      className={cn(
        "group block focus-visible:outline-none",
        className
      )}
    >
      <div className="img-zoom relative aspect-[4/5] overflow-hidden bg-muted ring-1 ring-inset ring-transparent transition-[box-shadow] duration-500 group-focus-visible:ring-foreground">
        <SafeImage
          src={mainImage}
          alt={label}
          fill
          priority={priority}
          fallbackLabel={label.charAt(0)}
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>
      {/* Nom puis univers empilés : aucune collision, lecture éditoriale. */}
      <div className="mt-4 space-y-1.5">
        <h3
          className={cn(
            "font-serif leading-tight tracking-tight",
            featured ? "text-2xl" : "text-lg"
          )}
        >
          <span className="link-underline pb-0.5">{label}</span>
        </h3>
        {type ? (
          <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
            {type}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
