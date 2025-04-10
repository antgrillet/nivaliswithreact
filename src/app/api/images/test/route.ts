import { NextResponse } from "next/server";

/**
 * Route de test pour l'API d'images
 * Retourne des exemples d'images pour la galerie sans avoir à lire le système de fichiers
 */
export async function GET() {
  // Crée un jeu d'images de test pour une marque
  const brandName = "Arpin";
  const basePath = `/img/${brandName}/`;

  // Exemples d'images (à adapter en fonction des images réellement disponibles)
  const mockImages = [
    `${basePath}image4.jpeg`,
    `${basePath}image003.jpg`,
    `${basePath}IMG_0253.jpg`,
  ];

  // Créez des images supplémentaires simulées pour tester la pagination
  const extendedImages = [...mockImages];

  // Pour tester la pagination, on ajoute des images supplémentaires
  for (let i = 1; i <= 15; i++) {
    extendedImages.push(`${basePath}simulated-image-${i}.jpg`);
  }

  return NextResponse.json({
    status: "success",
    folder: basePath,
    images: extendedImages,
    note: "Ceci est une API de test qui retourne des chemins d'images simulés pour le développement.",
  });
}
