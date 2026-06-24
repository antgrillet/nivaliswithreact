import { z } from "zod";

export const produitSchema = z.object({
  id: z.string().optional(),
  nom: z.string().trim().min(1, "Nom du produit requis"),
  description: z.string().trim().default(""),
  image: z.string().trim().default(""),
  prix: z.string().optional(),
});

export const marqueSchema = z.object({
  nom: z.string().trim().min(1, "Le nom de la marque est requis."),
  displayName: z.string().trim().optional(),
  description: z.string().trim().default(""),
  description_fr: z.string().optional(),
  description_en: z.string().optional(),
  type: z.string().trim().default(""),
  tags: z.array(z.string()).default([]),
  mainImage: z.string().optional(),
  logo: z.string().optional(),
  images: z.array(z.string()).default([]),
  videos: z.array(z.string()).default([]),
  imageFolder: z.string().optional(),
  website: z
    .string()
    .trim()
    .url("URL invalide")
    .optional()
    .or(z.literal("")),
  histoire: z.string().optional(),
  contact: z.record(z.string(), z.unknown()).optional(),
  produits: z.array(produitSchema).optional(),
});

/** Type de sortie (après application des defaults) — payload envoyé à l'API. */
export type MarqueInput = z.infer<typeof marqueSchema>;
/** Type d'entrée (champs optionnels) — utilisé comme valeurs de formulaire RHF. */
export type MarqueFormValues = z.input<typeof marqueSchema>;

/** Version partielle pour les mises à jour (merge côté serveur). */
export const marqueUpdateSchema = marqueSchema.partial().extend({
  nom: z.string().trim().min(1),
});
