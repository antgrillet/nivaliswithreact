/**
 * Slug déterministe et robuste (accents, casse, espaces, &, apostrophes, tirets internes).
 * Utilisé pour les URLs de marques : `slugify(nom)` côté serveur et côté liens.
 * Ex : "The North Face" -> "the-north-face", "K-Way" -> "k-way", "Säve" -> "save".
 */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
