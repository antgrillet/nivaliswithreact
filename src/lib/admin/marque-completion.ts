import type { MarqueInput } from "@/lib/schemas/marque";

export type SectionStatus = "ok" | "warn" | "empty";

export interface Completion {
  /** Nombre de critères clés remplis. */
  score: number;
  /** Nombre total de critères clés. */
  total: number;
  /** Libellés des critères clés non remplis (pour le tooltip). */
  missing: string[];
  /** Statut par section de l'éditeur (rail de navigation). */
  bySection: Record<string, SectionStatus>;
}

const str = (v: unknown): string => (typeof v === "string" ? v.trim() : "");
const hasAny = (...vals: unknown[]): boolean => vals.some((v) => str(v).length > 0);

/**
 * Calcule la complétude d'une marque : généralise le `missingFields` de
 * `MarquesTable` (logo, image principale, description) en l'étendant à 8 critères
 * clés, et fournit un statut tri-état par section pour le rail de navigation.
 */
export function computeCompletion(v: Partial<MarqueInput>): Completion {
  const images = Array.isArray(v.images) ? v.images.filter((u) => str(u)) : [];
  const videos = Array.isArray(v.videos) ? v.videos.filter((u) => str(u)) : [];
  const tags = Array.isArray(v.tags) ? v.tags.filter((t) => str(t)) : [];
  const produits = Array.isArray(v.produits) ? v.produits : [];
  const contact = (v.contact ?? {}) as Record<string, unknown>;

  const hasDescription = hasAny(v.description, v.description_fr, v.description_en);
  const hasContact = hasAny(
    contact.email,
    contact.telephone,
    contact.phone,
    contact.adresse,
    contact.address,
    contact.horaires
  );

  const criteria: { label: string; met: boolean }[] = [
    { label: "Logo", met: hasAny(v.logo) },
    { label: "Image principale", met: hasAny(v.mainImage) },
    { label: "Au moins une image de galerie", met: images.length > 0 },
    { label: "Description", met: hasDescription },
    { label: "Univers (type)", met: hasAny(v.type) },
    { label: "Au moins un tag", met: tags.length > 0 },
    { label: "Histoire ou site web", met: hasAny(v.histoire) || hasAny(v.website) },
    { label: "Coordonnées de contact", met: hasContact },
  ];

  const tri = (full: boolean, partial: boolean): SectionStatus =>
    full ? "ok" : partial ? "warn" : "empty";

  const bySection: Record<string, SectionStatus> = {
    medias: tri(
      hasAny(v.logo) && hasAny(v.mainImage) && images.length > 0,
      hasAny(v.logo) || hasAny(v.mainImage) || images.length > 0
    ),
    identite: tri(
      hasAny(v.type) && tags.length > 0,
      hasAny(v.type) || tags.length > 0 || hasAny(v.website) || hasAny(v.displayName)
    ),
    descriptions: tri(
      hasDescription && hasAny(v.histoire),
      hasDescription || hasAny(v.histoire)
    ),
    // Sections optionnelles : remplies ou vides, jamais « recommandé manquant ».
    videos: videos.length > 0 ? "ok" : "empty",
    produits: produits.length > 0 ? "ok" : "empty",
    contact: hasContact ? "ok" : "empty",
  };

  return {
    score: criteria.filter((c) => c.met).length,
    total: criteria.length,
    missing: criteria.filter((c) => !c.met).map((c) => c.label),
    bySection,
  };
}
