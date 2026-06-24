import "server-only";
import { unstable_cache } from "next/cache";
import { query } from "@/lib/db";
import { slugify } from "@/lib/slug";
import type { MarqueData } from "@/lib/types";

interface MarqueRow {
  nom: string;
  display_name: string | null;
  description: string;
  description_fr: string | null;
  description_en: string | null;
  image_folder: string | null;
  main_image: string | null;
  logo: string | null;
  images: string[] | null;
  videos: string[] | null;
  tags: string[] | null;
  type: string | null;
  website: string | null;
  histoire: string | null;
  contact: MarqueData["contact"] | null;
  produits: MarqueData["produits"] | null;
}

function mapRow(row: MarqueRow): MarqueData {
  return {
    nom: row.nom,
    displayName: row.display_name ?? undefined,
    description: row.description,
    description_fr: row.description_fr ?? undefined,
    description_en: row.description_en ?? undefined,
    imageFolder: row.image_folder ?? "",
    mainImage: row.main_image ?? "",
    logo: row.logo ?? "",
    images: row.images ?? [],
    videos: row.videos ?? [],
    tags: row.tags ?? [],
    type: row.type ?? "",
    website: row.website ?? undefined,
    histoire: row.histoire ?? undefined,
    contact: row.contact ?? undefined,
    produits: row.produits ?? undefined,
  };
}

/** Toutes les marques (triées), mises en cache et invalidées par le tag "marques". */
export const getMarques = unstable_cache(
  async (): Promise<MarqueData[]> => {
    const { rows } = await query<MarqueRow>("SELECT * FROM marques ORDER BY nom");
    return rows.map(mapRow);
  },
  ["marques-all"],
  { tags: ["marques"], revalidate: 300 }
);

/** Marque par nom exact (clé primaire). */
export async function getMarqueByNom(nom: string): Promise<MarqueData | null> {
  const marques = await getMarques();
  return marques.find((m) => m.nom === nom) ?? null;
}

/** Marque par slug robuste — corrige le matching fragile précédent. */
export async function getMarqueBySlug(slug: string): Promise<MarqueData | null> {
  const marques = await getMarques();
  return marques.find((m) => slugify(m.nom) === slug) ?? null;
}

/** Marques similaires (mêmes tags), hors marque courante. */
export async function getSimilarMarques(
  marque: MarqueData,
  limit = 3
): Promise<MarqueData[]> {
  const marques = await getMarques();
  const tags = new Set(marque.tags ?? []);
  return marques
    .filter((m) => m.nom !== marque.nom && (m.tags ?? []).some((t) => tags.has(t)))
    .slice(0, limit);
}
