/**
 * Utilitaires pour la gestion des images dans l'application
 */

/**
 * Encode correctement une URL d'image pour gérer les espaces et caractères spéciaux
 * @param src URL de l'image à encoder
 * @returns URL encodée
 */
export function encodeImageUrl(src: string): string {
  if (!src) return src;

  // Éviter de double encoder les URLs déjà encodées
  if (src.includes("%20") || src.includes("%2B") || src.includes("%2F")) {
    return src;
  }

  // Séparer le chemin en segments et encoder chaque segment séparément
  const urlParts = src.split("/");
  const encodedParts = urlParts.map((part, index) => {
    // Ne pas encoder le protocole ou les premiers segments vides
    if (index === 0 && (part.includes(":") || part === "")) {
      return part;
    }

    // Caractères problématiques pour les noms de fichiers
    if (
      part.includes("+") ||
      part.includes("(") ||
      part.includes(")") ||
      part.includes(" ")
    ) {
      return encodeURIComponent(part);
    }

    return part;
  });

  return encodedParts.join("/");
}

/**
 * Vérifie si une image existe
 * @param src URL de l'image à vérifier
 * @returns Promise<boolean> true si l'image existe
 */
export async function checkImageExists(src: string): Promise<boolean> {
  try {
    // Encoder l'URL
    const encodedSrc = encodeImageUrl(src);

    // Ajouter un timestamp pour éviter le cache du navigateur
    const url = `${encodedSrc}${
      encodedSrc.includes("?") ? "&" : "?"
    }_t=${Date.now()}`;

    // Vérifier si l'image existe
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch (err) {
    console.error("Erreur lors de la vérification de l'image:", err);
    return false;
  }
}

/**
 * Remplace les caractères problématiques dans les noms de fichiers
 * @param filename Nom du fichier à nettoyer
 * @returns Nom du fichier nettoyé
 */
export function sanitizeFileName(filename: string): string {
  return filename
    .replace(/\+/g, "_plus_")
    .replace(/\(/g, "_")
    .replace(/\)/g, "_")
    .replace(/\s+/g, "_")
    .replace(/&/g, "_and_");
}
