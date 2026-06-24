"use client";

import * as React from "react";
import Image, { type ImageProps } from "next/image";
import { getImageUrl, encodeImageUrl } from "@/utils/imageUtils";
import { cn } from "@/lib/utils";

type SafeImageProps = Omit<ImageProps, "src"> & {
  src?: string | null;
  /** Texte affiché dans le placeholder de repli (défaut : initiale/monogramme). */
  fallbackLabel?: string;
  /** Classe du placeholder de repli (pour les contextes sombres). */
  fallbackClassName?: string;
};

/**
 * Image résiliente : résout les URLs Blob / legacy via `getImageUrl`,
 * encode les chemins, et affiche un placeholder sobre en cas d'absence ou d'erreur.
 * Remplace l'ancien `Image.tsx` et les `checkImageExists` éparpillés.
 */
export function SafeImage({
  src,
  alt,
  className,
  fallbackLabel,
  fallbackClassName,
  fill,
  ...props
}: SafeImageProps) {
  const [errored, setErrored] = React.useState(false);
  const resolved = src ? encodeImageUrl(getImageUrl(src)) : "";

  if (!resolved || errored) {
    const monogram = (
      fallbackLabel ?? (typeof alt === "string" && alt ? alt.charAt(0) : "N")
    )
      .toString()
      .toUpperCase();

    return (
      <div
        aria-label={typeof alt === "string" ? alt : undefined}
        className={cn(
          "relative flex items-center justify-center overflow-hidden select-none",
          // Repli par défaut : carte « galerie » ivoire, lettre assumée.
          // Pour les fonds sombres, passer `fallbackClassName`.
          fallbackClassName ?? "bg-muted text-muted-foreground",
          fill && "absolute inset-0 h-full w-full",
          className
        )}
      >
        {/* Dégradé monochrome subtil + liseré fin : donne de la matière
            au repli pour qu'il évoque un placeholder de galerie, jamais une erreur.
            `currentColor` suit la couleur du texte (muted-foreground ou fallbackClassName). */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,currentColor_0%,transparent_60%)] opacity-[0.05]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 border border-current/10"
        />
        <span
          aria-hidden="true"
          className="font-serif text-3xl font-medium tracking-tight opacity-60"
        >
          {monogram}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={resolved}
      alt={alt}
      fill={fill}
      className={className}
      onError={() => setErrored(true)}
      {...props}
    />
  );
}

export default SafeImage;
