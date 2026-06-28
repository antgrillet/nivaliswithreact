import type { MarqueInput } from "@/lib/schemas/marque";

/** Payload minimal envoyé au PUT : uniquement les champs modifiés + le `nom` (clé). */
export type MarquePatch = Partial<MarqueInput> & { nom: string };

/** Un drapeau `dirtyFields` RHF est « vrai » s'il vaut true ou contient un sous-drapeau vrai. */
function isDirty(flag: unknown): boolean {
  if (!flag) return false;
  if (flag === true) return true;
  if (Array.isArray(flag)) return flag.some(isDirty);
  if (typeof flag === "object") {
    return Object.values(flag as Record<string, unknown>).some(isDirty);
  }
  return false;
}

/**
 * Construit le payload PUT minimal à partir des `dirtyFields` de React Hook Form.
 *
 * Pour chaque clé de premier niveau réellement modifiée, on envoie la valeur
 * ENTIÈRE : le merge serveur (`/api/cms/marques` PUT) remplace chaque clé en bloc
 * via `hasOwnProperty`, donc il faut transmettre la valeur complète (et non un
 * sous-ensemble). Le `nom` (clé primaire immuable) est toujours présent.
 *
 * Garantie anti-perte : tout champ NON modifié est absent du payload, donc
 * conservé tel quel en base — y compris en cas d'édition concurrente inter-onglets.
 */
export function buildPatch(
  values: MarqueInput,
  dirtyFields: Partial<Record<keyof MarqueInput, unknown>>
): MarquePatch {
  const patch: Record<string, unknown> = { nom: values.nom };
  for (const key of Object.keys(dirtyFields) as (keyof MarqueInput)[]) {
    if (key === "nom") continue;
    if (isDirty(dirtyFields[key])) {
      patch[key] = values[key];
    }
  }
  return patch as MarquePatch;
}
