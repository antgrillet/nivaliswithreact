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

/**
 * Détecte si une image est uploadée dynamiquement (contient un timestamp) ou statique
 * @param imagePath - Le chemin vers l'image (ex: "/img/Thenorthface/1752770423550-categorie_skis.jpg")
 * @returns true si l'image est uploadée dynamiquement, false sinon
 */
export function isUploadedImage(imagePath: string): boolean {
  if (!imagePath) return false
  
  // Extraire le nom du fichier
  const fileName = imagePath.split('/').pop() || ''
  
  // Vérifier si le nom commence par un timestamp (13 chiffres suivi d'un tiret)
  const timestampPattern = /^\d{13}-/
  return timestampPattern.test(fileName)
}

/**
 * Génère l'URL correcte pour servir une image
 * @param imagePath - Le chemin vers l'image (ex: "/img/Thenorthface/1752770423550-categorie_skis.jpg")
 * @returns L'URL à utiliser pour afficher l'image
 */
export function getImageUrl(imagePath: string): string {
  if (!imagePath) return ''
  
  // Si c'est une image uploadée dynamiquement, utiliser l'API
  if (isUploadedImage(imagePath)) {
    // Retirer le préfixe "/img/" et construire l'URL API
    const pathWithoutPrefix = imagePath.replace(/^\/img\//, '')
    return `/api/serve-image/${pathWithoutPrefix}`
  }
  
  // Sinon, utiliser le serveur statique normal
  return imagePath
}

/**
 * Génère l'URL avec cache-busting pour l'affichage dans l'admin
 * @param imagePath - Le chemin vers l'image
 * @returns L'URL avec paramètre de cache-busting
 */
export function getImageUrlWithCacheBusting(imagePath: string): string {
  const baseUrl = getImageUrl(imagePath)
  
  // Ajouter le cache-busting seulement si c'est une image uploadée
  if (isUploadedImage(imagePath)) {
    return `${baseUrl}?t=${Date.now()}`
  }
  
  return baseUrl
}
