/**
 * Utilitaires pour la gestion des images dans l'application
 * Compatible avec Vercel Blob Storage et images locales legacy
 */

/**
 * Determine si une URL est une URL Vercel Blob
 */
export function isBlobUrl(url: string): boolean {
  if (!url) return false;
  return url.includes('blob.vercel-storage.com');
}

/**
 * Detecte si une image est uploadee dynamiquement (contient un timestamp) ou statique
 * @param imagePath - Le chemin vers l'image (ex: "/img/Thenorthface/1752770423550-categorie_skis.jpg")
 * @returns true si l'image est uploadee dynamiquement, false sinon
 */
export function isUploadedImage(imagePath: string): boolean {
  if (!imagePath) return false;

  // Les URLs Blob sont considerees comme uploadees
  if (isBlobUrl(imagePath)) return true;

  // Extraire le nom du fichier
  const fileName = imagePath.split('/').pop() || '';

  // Verifier si le nom commence par un timestamp (13 chiffres suivi d'un tiret)
  const timestampPattern = /^\d{13}-/;
  return timestampPattern.test(fileName);
}

/**
 * Determine si une URL est une image locale legacy
 */
export function isLocalImage(url: string): boolean {
  if (!url) return false;
  return url.startsWith('/img/') || url.startsWith('img/');
}

/**
 * Genere l'URL correcte pour servir une image
 * - URLs Blob: utilisation directe (CDN automatique)
 * - URLs locales legacy: prefixe si necessaire
 * - URLs locales uploadees: route via API serve-image
 * @param imagePath - Le chemin vers l'image
 * @returns L'URL a utiliser pour afficher l'image
 */
export function getImageUrl(imagePath: string): string {
  if (!imagePath) return '';

  // URLs Blob sont deja completes - utilisation directe
  if (isBlobUrl(imagePath)) {
    return imagePath;
  }

  // URLs externes
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // Images locales avec timestamp (legacy uploads) - utiliser l'API
  if (isLocalImage(imagePath)) {
    const fileName = imagePath.split('/').pop() || '';
    const timestampPattern = /^\d{13}-/;

    if (timestampPattern.test(fileName)) {
      const pathWithoutPrefix = imagePath.replace(/^\/img\//, '');
      return `/api/serve-image/${pathWithoutPrefix}`;
    }

    // Image locale statique
    return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  }

  return imagePath;
}

/**
 * Genere l'URL avec cache-busting pour l'affichage dans l'admin
 * - URLs Blob: pas de cache-busting necessaire (suffixe aleatoire)
 * - URLs locales: ajoute timestamp
 * @param imagePath - Le chemin vers l'image
 * @returns L'URL avec parametre de cache-busting si necessaire
 */
export function getImageUrlWithCacheBusting(imagePath: string): string {
  if (!imagePath) return '';

  const baseUrl = getImageUrl(imagePath);

  // Pas de cache-busting pour Blob (URLs deja uniques avec suffixe aleatoire)
  if (isBlobUrl(imagePath)) {
    return baseUrl;
  }

  // Cache-busting pour images locales legacy
  return `${baseUrl}?t=${Date.now()}`;
}

/**
 * Encode correctement une URL d'image pour gerer les espaces et caracteres speciaux
 * @param src URL de l'image a encoder
 * @returns URL encodee
 */
export function encodeImageUrl(src: string): string {
  if (!src) return src;

  // Eviter de double encoder les URLs deja encodees
  if (src.includes("%20") || src.includes("%2B") || src.includes("%2F")) {
    return src;
  }

  // Les URLs Blob sont deja bien formattees
  if (isBlobUrl(src)) {
    return src;
  }

  // Separer le chemin en segments et encoder chaque segment separement
  const urlParts = src.split("/");
  const encodedParts = urlParts.map((part, index) => {
    // Ne pas encoder le protocole ou les premiers segments vides
    if (index === 0 && (part.includes(":") || part === "")) {
      return part;
    }

    // Caracteres problematiques pour les noms de fichiers
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
 * Verifie si une image existe
 * @param src URL de l'image a verifier
 * @returns Promise<boolean> true si l'image existe
 */
export async function checkImageExists(src: string): Promise<boolean> {
  try {
    // Encoder l'URL
    const encodedSrc = encodeImageUrl(src);

    // Ajouter un timestamp pour eviter le cache du navigateur (sauf pour Blob)
    const url = isBlobUrl(encodedSrc)
      ? encodedSrc
      : `${encodedSrc}${encodedSrc.includes("?") ? "&" : "?"}_t=${Date.now()}`;

    // Verifier si l'image existe
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch (err) {
    console.error("Erreur lors de la verification de l'image:", err);
    return false;
  }
}

/**
 * Remplace les caracteres problematiques dans les noms de fichiers
 * @param filename Nom du fichier a nettoyer
 * @returns Nom du fichier nettoye
 */
export function sanitizeFileName(filename: string): string {
  return filename
    .replace(/\+/g, "_plus_")
    .replace(/\(/g, "_")
    .replace(/\)/g, "_")
    .replace(/\s+/g, "_")
    .replace(/&/g, "_and_");
}
