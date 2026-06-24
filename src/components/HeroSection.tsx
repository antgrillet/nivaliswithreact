"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { getImageUrl } from "@/utils/imageUtils";
import { slugify } from "@/lib/slug";
import type { MarqueData } from "@/lib/types";

interface HeroContent {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  description?: string;
}

interface HeroSectionProps {
  brands?: MarqueData[];
  content?: HeroContent;
}

export default function HeroSection({ brands = [], content }: HeroSectionProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [errored, setErrored] = useState<Record<string, boolean>>({});
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const highlighted = useMemo(() => {
    const withVideo = brands.filter((m) => m.videos && m.videos.length > 0);
    const withImage = brands.filter(
      (m) => m.mainImage && (!m.videos || !m.videos.length)
    );
    return [...withVideo, ...withImage].slice(0, 5);
  }, [brands]);

  const next = useCallback(() => {
    setIndex((p) => (highlighted.length ? (p + 1) % highlighted.length : 0));
  }, [highlighted.length]);

  useEffect(() => {
    if (paused || highlighted.length < 2) return;
    timer.current = setInterval(next, 6000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused, next, highlighted.length]);

  const current = highlighted[index];
  const eyebrow = content?.eyebrow || "Les Gets · Depuis 2010";
  const title = content?.title || "L'élégance brute de la montagne";
  const description =
    content?.description ||
    "Une maison de marques premium outdoor au cœur des Gets — sélection d'exception, conseil sur mesure, esprit alpin.";

  return (
    <section
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-foreground text-background"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Marques en vitrine"
    >
      {/* Fond : image/vidéo N&B en fondu */}
      <AnimatePresence mode="sync">
        <motion.div
          key={current?.nom ?? "empty"}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: "easeInOut" as const }}
        >
          {current?.videos && current.videos.length > 0 ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover grayscale"
              aria-hidden="true"
            >
              <source src={getImageUrl(current.videos[0])} type="video/mp4" />
            </video>
          ) : current && !errored[current.nom] ? (
            <Image
              src={getImageUrl(current.mainImage)}
              alt=""
              fill
              priority
              aria-hidden="true"
              className="object-cover grayscale"
              sizes="100vw"
              onError={() => setErrored((p) => ({ ...p, [current.nom]: true }))}
            />
          ) : (
            <div className="h-full w-full bg-foreground" />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Voile pour lisibilité — allégé en haut pour laisser respirer le média */}
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/25 to-foreground/35" />

      {/* Contenu */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-16 pt-28 sm:pb-20 lg:px-10">
        <div className="max-w-3xl animate-fadeSlideUp">
          <p className="eyebrow text-background/70">{eyebrow}</p>
          <h1 className="mt-6 font-serif text-5xl font-medium leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-background/80">
            {description}
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Button
              asChild
              size="lg"
              className="bg-background text-foreground hover:bg-background/90"
            >
              <Link href="/marques">Découvrir les marques</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-background/40 bg-transparent text-background hover:border-background hover:bg-background/10 hover:text-background"
            >
              <Link href="/contact">Nous contacter</Link>
            </Button>
          </div>
        </div>

        {/* Sélecteur de marques en vitrine + position */}
        {highlighted.length > 1 && (
          <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-background/15 pt-6">
            <span className="text-xs uppercase tracking-[0.2em] text-background/50">
              En vitrine
            </span>
            {highlighted.map((brand, i) => {
              const label = brand.displayName?.trim() || brand.nom;
              return (
                <Link
                  key={brand.nom}
                  href={`/marques/${slugify(brand.nom)}`}
                  onMouseEnter={() => setIndex(i)}
                  aria-current={i === index ? "true" : undefined}
                  className={`text-sm tracking-wide transition-colors ${
                    i === index
                      ? "text-background [text-decoration:underline] underline-offset-4"
                      : "text-background/50 hover:text-background/80"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
            <span
              className="ml-auto font-serif text-sm tabular-nums text-background/50"
              aria-hidden="true"
            >
              {String(index + 1).padStart(2, "0")} / {String(highlighted.length).padStart(2, "0")}
            </span>
          </div>
        )}
      </div>

      {/* Indicateur de défilement */}
      <div className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-background/60">
        <ArrowDown className="size-5 animate-bounce" />
      </div>
    </section>
  );
}
