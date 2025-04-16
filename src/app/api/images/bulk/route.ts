import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * API pour récupérer les images de plusieurs dossiers de marques
 * Utile pour les pages comme l'index des marques où on affiche des images de plusieurs marques
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);

    // Récupération des marques demandées (sous forme de liste séparée par des virgules)
    const brands = url.searchParams.get("brands");
    // Nombre maximum d'images par marque
    const limit = parseInt(url.searchParams.get("limit") || "3", 10);

    // Si aucune marque n'est spécifiée, on retourne toutes les marques disponibles
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

    // Si aucune marque n'est spécifiée, on liste les dossiers disponibles
    if (!brands) {
      const directories = fs.readdirSync(imgDir).filter((item) => {
        const itemPath = path.join(imgDir, item);
        return fs.existsSync(itemPath) && fs.statSync(itemPath).isDirectory();
      });

      return NextResponse.json({
        brands: directories.map((dir) => ({
          name: dir,
          path: `/img/${dir}/`,
        })),
      });
    }

    // Fonction pour récupérer les images d'un dossier
    const getImagesFromFolder = (folder: string) => {
      const folderPath = path.join(imgDir, folder);

      // Vérification de l'existence du dossier
      if (!fs.existsSync(folderPath)) {
        return {
          name: folder,
          path: `/img/${folder}/`,
          error: "Dossier non trouvé",
          images: [],
        };
      }

      // Extensions d'images supportées
      const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

      // Récupération des fichiers d'images
      const files = fs
        .readdirSync(folderPath)
        .filter((file) => {
          const ext = path.extname(file).toLowerCase();
          const fileName = file.toLowerCase();

          // Exclure les fichiers avec "logo" dans leur nom
          return imageExtensions.includes(ext) && !fileName.includes("logo");
        })
        .slice(0, limit); // Limiter le nombre d'images

      // Construction des chemins d'accès aux images
      const imagePaths = files.map((file) => `/img/${folder}/${file}`);

      return {
        name: folder,
        path: `/img/${folder}/`,
        images: imagePaths,
      };
    };

    // Traitement de chaque marque demandée
    const brandList = brands.split(",").map((b) => b.trim());
    const results = brandList.map(getImagesFromFolder);

    return NextResponse.json({
      results,
    });
  } catch (error: unknown) {
    const apiError = error as { message: string; stack?: string };
    console.error("Erreur lors de la récupération des images:", apiError);
    return NextResponse.json(
      {
        error: "Erreur serveur lors de la récupération des images",
        message: apiError.message,
        stack:
          process.env.NODE_ENV === "development" ? apiError.stack : undefined,
      },
      { status: 500 }
    );
  }
}
