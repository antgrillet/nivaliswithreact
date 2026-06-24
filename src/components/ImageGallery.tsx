"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { SafeImage } from "@/components/SafeImage";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
  /** Nom de la marque (alt + libellé éditorial). */
  nom: string;
}

/**
 * Galerie monochrome « Galerie Monochrome ».
 * Grille d'images en niveaux de gris qui passent en couleur au survol,
 * lightbox plein écran sobre (fond encre), navigation clavier ←/→/Échap,
 * focus trap simple et verrouillage du défilement.
 */
export default function ImageGallery({ images, nom }: ImageGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const isOpen = openIndex !== null;
  const total = images.length;

  const close = useCallback(() => setOpenIndex(null), []);
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i + 1) % total)),
    [total]
  );
  const prev = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i - 1 + total) % total)),
    [total]
  );

  const openAt = (index: number, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    setOpenIndex(index);
  };

  // Navigation clavier + focus trap minimal (Tab piégé sur la lightbox)
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          e.preventDefault();
          close();
          break;
        case "ArrowRight":
          e.preventDefault();
          next();
          break;
        case "ArrowLeft":
          e.preventDefault();
          prev();
          break;
        case "Tab":
          // Focus trap simple : on garde le focus dans l'overlay
          e.preventDefault();
          closeRef.current?.focus();
          break;
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, close, next, prev]);

  // Restaure le focus sur la vignette d'origine à la fermeture
  useEffect(() => {
    if (!isOpen && triggerRef.current) {
      triggerRef.current.focus();
      triggerRef.current = null;
    }
  }, [isOpen]);

  if (total === 0) return null;

  return (
    <section className="bg-background py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">La collection</p>
            <h2 className="mt-4 font-serif text-3xl tracking-tight md:text-4xl">
              {nom} en images
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            {total} {total > 1 ? "visuels" : "visuel"}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {images.map((img, i) => (
            <button
              key={`${img}-${i}`}
              type="button"
              onClick={(e) => openAt(i, e.currentTarget)}
              aria-label={`Agrandir le visuel ${i + 1} de ${nom}`}
              className="img-zoom group relative aspect-square overflow-hidden bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <SafeImage
                src={img}
                alt={`Visuel ${i + 1} de ${nom}`}
                fill
                fallbackLabel={nom.charAt(0)}
                className="object-cover grayscale transition-[filter] duration-700 group-hover:grayscale-0"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                priority={i < 4}
              />
            </button>
          ))}
        </div>
      </div>

      {isOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Visuels de ${nom}`}
          className="animate-fadeIn fixed inset-0 z-[60] flex flex-col bg-foreground text-background"
          onClick={close}
        >
          <div className="flex items-center justify-between px-6 py-5 lg:px-10">
            <span className="text-xs uppercase tracking-[0.2em] text-background/60">
              {(openIndex ?? 0) + 1} / {total}
            </span>
            <button
              ref={closeRef}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                close();
              }}
              aria-label="Fermer"
              className="flex size-10 items-center justify-center border border-background/25 text-background outline-none transition-colors hover:bg-background hover:text-foreground focus-visible:bg-background focus-visible:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>

          <div
            className="relative flex flex-1 items-center justify-center px-6 pb-10 lg:px-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-full w-full max-w-5xl">
              <SafeImage
                key={openIndex}
                src={images[openIndex ?? 0]}
                alt={`Visuel ${(openIndex ?? 0) + 1} de ${nom}`}
                fill
                fallbackLabel={nom.charAt(0)}
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>

            {total > 1 ? (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prev();
                  }}
                  aria-label="Visuel précédent"
                  className="absolute left-4 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center border border-background/25 text-background outline-none transition-colors hover:bg-background hover:text-foreground focus-visible:bg-background focus-visible:text-foreground lg:left-6"
                >
                  <ArrowLeft className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    next();
                  }}
                  aria-label="Visuel suivant"
                  className="absolute right-4 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center border border-background/25 text-background outline-none transition-colors hover:bg-background hover:text-foreground focus-visible:bg-background focus-visible:text-foreground lg:right-6"
                >
                  <ArrowRight className="size-5" />
                </button>
              </>
            ) : null}
          </div>

          {total > 1 ? (
            <div
              className="px-6 pb-6 lg:px-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto flex max-w-3xl gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={`thumb-${img}-${i}`}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenIndex(i);
                    }}
                    aria-label={`Aller au visuel ${i + 1}`}
                    aria-current={i === openIndex}
                    className={cn(
                      "relative h-14 w-14 shrink-0 overflow-hidden border outline-none transition-opacity",
                      i === openIndex
                        ? "border-background opacity-100"
                        : "border-background/20 opacity-50 hover:opacity-90"
                    )}
                  >
                    <SafeImage
                      src={img}
                      alt=""
                      fill
                      fallbackLabel={nom.charAt(0)}
                      className="object-cover"
                      sizes="56px"
                    />
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
