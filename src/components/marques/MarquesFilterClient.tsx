"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search, SlidersHorizontal, Star, X } from "lucide-react";
import BrandCard from "@/components/BrandCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { MarqueData } from "@/lib/types";

interface MarquesFilterClientProps {
  marques: MarqueData[];
}

const ALL_TYPES = "Tous";
const ALL_TAGS = "Toutes";
const PAGE_SIZE = 12;
const FAVORITES_KEY = "nivalis:marques:favoris";

/**
 * Filtre + grille des marques (esprit galerie monochrome).
 * Reçoit toutes les marques en props : aucune requête côté client.
 * Recherche debounced, filtres tag/type à divulgation progressive,
 * favoris persistés en localStorage, pagination « voir plus ».
 */
export default function MarquesFilterClient({
  marques,
}: MarquesFilterClientProps) {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState(ALL_TAGS);
  const [activeType, setActiveType] = useState(ALL_TYPES);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Recherche debounced (300 ms) sans dépendance externe.
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearch(searchInput), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchInput]);

  // Favoris : lecture initiale puis persistance.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) setFavorites(JSON.parse(stored));
    } catch {
      // Stockage indisponible ou corrompu : on ignore silencieusement.
    }
  }, []);

  const toggleFavorite = useCallback((nom: string) => {
    setFavorites((prev) => {
      const next = prev.includes(nom)
        ? prev.filter((n) => n !== nom)
        : [...prev, nom];
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      } catch {
        // Persistance best-effort.
      }
      return next;
    });
  }, []);

  const tags = useMemo(
    () => [
      ALL_TAGS,
      ...Array.from(new Set(marques.flatMap((m) => m.tags ?? []))).sort(
        (a, b) => a.localeCompare(b, "fr")
      ),
    ],
    [marques]
  );

  const types = useMemo(
    () => [
      ALL_TYPES,
      ...Array.from(
        new Set(marques.map((m) => m.type).filter(Boolean))
      ).sort((a, b) => a.localeCompare(b, "fr")),
    ],
    [marques]
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return marques.filter((m) => {
      if (activeTag !== ALL_TAGS && !(m.tags ?? []).includes(activeTag))
        return false;
      if (activeType !== ALL_TYPES && m.type !== activeType) return false;
      if (onlyFavorites && !favorites.includes(m.nom)) return false;
      if (term) {
        const haystack = [m.nom, m.displayName, m.description, m.type, ...(m.tags ?? [])]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });
  }, [marques, search, activeTag, activeType, onlyFavorites, favorites]);

  // Réinitialise la pagination quand le résultat change.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search, activeTag, activeType, onlyFavorites]);

  const hasActiveFilters =
    activeTag !== ALL_TAGS ||
    activeType !== ALL_TYPES ||
    onlyFavorites ||
    search !== "";

  const resetFilters = useCallback(() => {
    setSearchInput("");
    setSearch("");
    setActiveTag(ALL_TAGS);
    setActiveType(ALL_TYPES);
    setOnlyFavorites(false);
  }, []);

  const visible = filtered.slice(0, visibleCount);

  return (
    <section id="selection" className="scroll-mt-20 bg-background pb-24 md:pb-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Barre de contrôle */}
        <div className="border-b border-border py-6 md:py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-lg">
              <label htmlFor="marque-search" className="sr-only">
                Rechercher une marque
              </label>
              <Search
                className="pointer-events-none absolute left-0 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                id="marque-search"
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Rechercher une marque…"
                autoComplete="off"
                className="h-12 w-full border-b border-border bg-transparent pl-7 pr-10 text-base text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
              />
              {searchInput ? (
                <button
                  type="button"
                  onClick={() => setSearchInput("")}
                  className="absolute right-0 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Effacer la recherche"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-expanded={filtersOpen}
                aria-controls="marques-filters"
                onClick={() => setFiltersOpen((value) => !value)}
                className={cn(
                  "inline-flex h-11 flex-1 items-center justify-center gap-2 border px-4 text-sm transition-colors md:flex-none",
                  filtersOpen || activeTag !== ALL_TAGS || activeType !== ALL_TYPES
                    ? "border-foreground bg-foreground text-background"
                    : "border-border hover:border-foreground"
                )}
              >
                <SlidersHorizontal className="size-4" aria-hidden="true" />
                Filtres
                {(activeTag !== ALL_TAGS || activeType !== ALL_TYPES) && (
                  <span aria-label="Filtres actifs">
                    ({Number(activeTag !== ALL_TAGS) + Number(activeType !== ALL_TYPES)})
                  </span>
                )}
              </button>

              <button
                type="button"
                aria-pressed={onlyFavorites}
                onClick={() => setOnlyFavorites((value) => !value)}
                className={cn(
                  "inline-flex size-11 shrink-0 items-center justify-center border transition-colors",
                  onlyFavorites
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                )}
                aria-label={onlyFavorites ? "Afficher toutes les marques" : "Afficher les favoris"}
              >
                <Star className={cn("size-4", onlyFavorites && "fill-current")} aria-hidden="true" />
              </button>
            </div>
          </div>

          {filtersOpen ? (
            <div
              id="marques-filters"
              className="mt-8 grid gap-8 border-t border-border pt-8 lg:grid-cols-2"
            >
              <div>
                <p className="eyebrow">Univers</p>
                <div
                  role="group"
                  aria-label="Filtrer par univers"
                  className="mt-4 flex flex-wrap gap-2"
                >
                  {types.map((type) => {
                    const isActive = activeType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => setActiveType(type)}
                        className={cn(
                          "min-h-11 border px-3 py-2 text-left text-sm transition-colors",
                          isActive
                            ? "border-foreground bg-foreground text-background"
                            : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                        )}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              {tags.length > 1 ? (
                <div>
                  <p className="eyebrow">Catégorie</p>
                  <div
                    role="group"
                    aria-label="Filtrer par catégorie"
                    className="mt-4 flex flex-wrap gap-2"
                  >
                    {tags.map((tag) => {
                      const isActive = activeTag === tag;
                      return (
                        <button
                          key={tag}
                          type="button"
                          aria-pressed={isActive}
                          onClick={() => setActiveTag(tag)}
                          className={cn(
                            "min-h-11 border px-3 py-2 text-sm transition-colors",
                            isActive
                            ? "border-foreground bg-foreground text-background"
                            : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                          )}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {filtered.length}{" "}
              {filtered.length > 1 ? "marques affichées" : "marque affichée"}
            </p>
            <div className="flex items-center gap-5">
              {favorites.length > 0 ? (
                <span className="text-xs text-muted-foreground">
                  {favorites.length} {favorites.length > 1 ? "favoris" : "favori"}
                </span>
              ) : null}
              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="link-underline pb-0.5 text-sm tracking-wide text-muted-foreground transition-opacity hover:text-foreground"
                >
                  Réinitialiser
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {/* Grille / état vide */}
        {visible.length > 0 ? (
          <>
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:mt-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-y-14">
              {visible.map((marque, i) => {
                const isFavorite = favorites.includes(marque.nom);
                const label = marque.displayName?.trim() || marque.nom;
                return (
                  <div key={marque.nom} className="group/card relative">
                    <BrandCard
                      nom={marque.nom}
                      displayName={marque.displayName}
                      type={marque.type}
                      mainImage={marque.mainImage}
                      description={marque.description}
                      logo={marque.logo}
                      priority={i < 4}
                    />
                    <button
                      type="button"
                      onClick={() => toggleFavorite(marque.nom)}
                      aria-pressed={isFavorite}
                      aria-label={
                        isFavorite
                          ? `Retirer ${label} des favoris`
                          : `Ajouter ${label} aux favoris`
                      }
                      className={cn(
                        "absolute right-2 top-2 z-10 flex size-11 items-center justify-center border bg-background/85 backdrop-blur-sm transition-all duration-300 md:right-3 md:top-3 md:size-9",
                        isFavorite
                          ? "border-foreground text-foreground opacity-100"
                          : "border-border text-muted-foreground opacity-0 hover:text-foreground focus-visible:opacity-100 group-hover/card:opacity-100"
                      )}
                    >
                      <Star
                        className={cn("size-4", isFavorite && "fill-current")}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                );
              })}
            </div>

            {visibleCount < filtered.length ? (
              <div className="mt-20 flex justify-center">
                <Button
                  variant="outline"
                  onClick={() =>
                    setVisibleCount((c) => c + PAGE_SIZE)
                  }
                >
                  Voir plus de marques
                </Button>
              </div>
            ) : null}
          </>
        ) : (
          <div className="mt-24 border-t border-border pt-24 text-center">
            <p className="font-serif text-2xl tracking-tight text-foreground">
              Aucune marque ne correspond
            </p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              Affinez votre recherche ou réinitialisez les filtres pour
              retrouver l&apos;ensemble de la sélection.
            </p>
            {hasActiveFilters ? (
              <Button
                variant="outline"
                onClick={resetFilters}
                className="mt-8"
              >
                Réinitialiser les filtres
              </Button>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
