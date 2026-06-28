import "server-only";
import { query } from "@/lib/db";
import type { MarqueData } from "@/lib/types";

/**
 * Lecture d'une marque pour l'ÉDITION admin — volontairement NON mise en cache
 * (contrairement à `getMarques()` cachée 300 s, tag « marques »). On veut la
 * donnée fraîche juste après un enregistrement, sans attendre l'invalidation.
 */

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

/** Marque par nom exact (clé primaire), lecture directe non cachée. */
export async function getMarqueForEdit(nom: string): Promise<MarqueData | null> {
  const { rows } = await query<MarqueRow>(
    "SELECT * FROM marques WHERE nom = $1",
    [nom]
  );
  return rows[0] ? mapRow(rows[0]) : null;
}
