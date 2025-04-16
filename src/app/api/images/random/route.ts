import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * API pour récupérer des images aléatoires
 * Utile pour les pages d'accueil ou les sliders
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);

    // Paramètres de l'API
    const brand = url.searchParams.get("brand"); // Marque spécifique (optionnel)
    const count = parseInt(url.searchParams.get("count") || "5", 10); // Nombre d'images à retourner

    const publicDir = path.join(process.cwd(), "public");
    const imgDir = path.join(publicDir, "img");

    // Vérification que le dossier d'images existe
    if (!fs.existsSync(imgDir)) {
      return NextResponse.json(
        {
          error: "Dossier d'images non trouvé",
          path: "/img",
        },
        { status: 404 }
      );
    }

    // Extensions d'images supportées
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

    // Fonction pour récupérer des images aléatoires d'un dossier
    const getRandomImagesFromFolder = (
      folder: string,
      limit: number
    ): string[] => {
      const folderPath = path.join(imgDir, folder);

      // Vérification de l'existence du dossier
      if (!fs.existsSync(folderPath)) {
        return [];
      }

      // Récupération des fichiers d'images
      const allFiles = fs.readdirSync(folderPath).filter((file) => {
        const ext = path.extname(file).toLowerCase();
        const fileName = file.toLowerCase();

        // Exclure les fichiers avec "logo" dans leur nom
        return imageExtensions.includes(ext) && !fileName.includes("logo");
      });

      // Si pas d'images, on retourne un tableau vide
      if (allFiles.length === 0) {
        return [];
      }

      // Sélection aléatoire d'images
      const randomImages: string[] = [];
      const maxImages = Math.min(limit, allFiles.length);

      // Si on veut toutes les images ou presque, on peut éviter le tirage au sort
      if (maxImages >= allFiles.length * 0.8) {
        // On retourne simplement les X premières images
        return allFiles
          .slice(0, maxImages)
          .map((file) => `/img/${folder}/${file}`);
      }

      // Sinon, on tire au sort
      const usedIndices = new Set<number>();

      for (let i = 0; i < maxImages; i++) {
        let randomIndex;
        // On s'assure de ne pas prendre deux fois la même image
        do {
          randomIndex = Math.floor(Math.random() * allFiles.length);
        } while (usedIndices.has(randomIndex));

        usedIndices.add(randomIndex);
        randomImages.push(`/img/${folder}/${allFiles[randomIndex]}`);
      }

      return randomImages;
    };

    // Si une marque spécifique est demandée
    if (brand) {
      const images = getRandomImagesFromFolder(brand, count);

      if (images.length === 0) {
        return NextResponse.json(
          {
            error: "Aucune image trouvée pour cette marque",
            brand,
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        brand,
        images,
      });
    }

    // Sinon, on récupère des images de toutes les marques disponibles
    const directories = fs.readdirSync(imgDir).filter((item) => {
      const itemPath = path.join(imgDir, item);
      return fs.existsSync(itemPath) && fs.statSync(itemPath).isDirectory();
    });

    // On récupère quelques images de chaque marque
    const imagesPerBrand = Math.max(1, Math.ceil(count / directories.length));
    let allImages: { brand: string; image: string }[] = [];

    directories.forEach((dir) => {
      const brandImages = getRandomImagesFromFolder(dir, imagesPerBrand);
      allImages = allImages.concat(
        brandImages.map((img) => ({ brand: dir, image: img }))
      );
    });

    // On mélange le résultat et on limite au nombre demandé
    allImages.sort(() => Math.random() - 0.5);
    allImages = allImages.slice(0, count);

    return NextResponse.json({
      images: allImages,
    });
  } catch (error: unknown) {
    const apiError = error as { message: string; stack?: string };
    console.error(
      "Erreur lors de la récupération des images aléatoires:",
      apiError
    );
    return NextResponse.json(
      {
        error: "Erreur serveur lors de la récupération des images aléatoires",
        message: apiError.message,
        stack:
          process.env.NODE_ENV === "development" ? apiError.stack : undefined,
      },
      { status: 500 }
    );
  }
}
