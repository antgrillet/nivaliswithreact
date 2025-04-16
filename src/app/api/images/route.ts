import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * Gestionnaire de requête GET pour l'API d'images
 * Récupère les images du dossier spécifié par le paramètre "folder"
 */
export async function GET(request: NextRequest) {
  try {
    // Récupération du paramètre folder depuis l'URL
    const url = new URL(request.url);
    const folderPath = url.searchParams.get("folder");

    // Vérification que le paramètre folder est présent
    if (!folderPath) {
      return NextResponse.json(
        { error: "Le paramètre 'folder' est requis" },
        { status: 400 }
      );
    }

    // Normalisation du chemin du dossier (enlever les caractères dangereux)
    const sanitizedPath = folderPath.replace(/\.\./g, "").replace(/\/+/g, "/");

    // Construction du chemin absolu vers le dossier d'images dans public
    const publicDir = path.join(process.cwd(), "public");

    // Gestion des noms de dossier avec des espaces
    // Convertir le chemin URL en chemin système de fichiers
    const decodedPath = decodeURIComponent(sanitizedPath);
    let fullPath = path.join(publicDir, decodedPath);

    console.log("Chemin complet initial:", fullPath);

    // Vérification que le chemin est contenu dans public pour des raisons de sécurité
    if (!fullPath.startsWith(publicDir)) {
      return NextResponse.json(
        { error: "Chemin non autorisé" },
        { status: 403 }
      );
    }

    // Vérification que le dossier existe
    let directoryExists = fs.existsSync(fullPath);

    // Si le chemin ne se termine pas par /, on essaie avec
    if (!directoryExists && !fullPath.endsWith(path.sep)) {
      fullPath += path.sep;
      directoryExists = fs.existsSync(fullPath);
      console.log(
        "Tentative avec séparateur de chemin:",
        fullPath,
        directoryExists
      );
    }

    // Si le dossier n'existe toujours pas, on tente une recherche insensible à la casse
    if (!directoryExists) {
      const parentDir = path.dirname(fullPath);
      const targetDir = path.basename(fullPath);

      console.log("Recherche sans casse:", parentDir, targetDir);

      if (fs.existsSync(parentDir)) {
        // Recherche du dossier sans tenir compte de la casse
        const dirEntries = fs.readdirSync(parentDir);
        console.log("Entrées de dossier:", dirEntries);

        const matchingDir = dirEntries.find((entry) => {
          const entryLower = entry.toLowerCase();
          const targetLower = targetDir.toLowerCase();
          const isMatch = entryLower === targetLower;
          const isDir =
            fs.existsSync(path.join(parentDir, entry)) &&
            fs.statSync(path.join(parentDir, entry)).isDirectory();

          console.log(
            `Comparaison: "${entryLower}" vs "${targetLower}" = ${isMatch}, estDossier = ${isDir}`
          );

          return isMatch && isDir;
        });

        if (matchingDir) {
          fullPath = path.join(parentDir, matchingDir);
          directoryExists = true;
          console.log("Dossier correspondant trouvé:", fullPath);
        }
      }
    }

    // Essayer une dernière méthode pour trouver le dossier
    if (!directoryExists) {
      const imgDir = path.join(publicDir, "img");
      if (fs.existsSync(imgDir)) {
        const allDirs = fs.readdirSync(imgDir);
        const possibleMatch = allDirs.find(
          (dir) =>
            dir.toLowerCase() === path.basename(decodedPath).toLowerCase()
        );

        if (possibleMatch) {
          fullPath = path.join(imgDir, possibleMatch);
          directoryExists =
            fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory();
          console.log(
            "Correspondance alternative trouvée:",
            fullPath,
            directoryExists
          );
        }
      }
    }

    // Si le dossier n'existe toujours pas après ces tentatives
    if (!directoryExists) {
      return NextResponse.json(
        {
          error: "Dossier non trouvé",
          path: sanitizedPath,
          decodedPath,
          fullPath: fullPath.replace(publicDir, ""), // Pour le débogage
        },
        { status: 404 }
      );
    }

    // Liste des extensions de fichiers d'images communes
    const imageExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      ".svg",
      ".avif",
      ".bmp",
    ];

    // Lecture du contenu du dossier
    const files = fs.readdirSync(fullPath);
    console.log("Fichiers trouvés:", files);

    // Filtrage des fichiers pour ne garder que les images
    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      const fileName = file.toLowerCase();

      // Exclure les fichiers avec "logo" dans leur nom
      return imageExtensions.includes(ext) && !fileName.includes("logo");
    });

    // Construction des chemins d'accès complets pour les images
    // On utilise le chemin relatif depuis la racine du site (pour les balises <img>)
    const imagePaths = imageFiles.map((file) => {
      // On reconstruit le chemin URL en utilisant le chemin original du dossier
      // mais en ajoutant le nom de fichier au chemin
      const folderPathWithTrailingSlash = sanitizedPath.endsWith("/")
        ? sanitizedPath
        : `${sanitizedPath}/`;

      // Construire le chemin avec le nom du fichier
      // Utiliser le nom de fichier tel qu'il est sur le disque, sans l'encoder
      // car Next.js fera l'encodage au moment d'afficher l'image
      return `${folderPathWithTrailingSlash}${file}`;
    });

    console.log("Chemins d'images finaux:", imagePaths);

    // Réponse avec la liste des chemins d'images (triés alphabétiquement)
    return NextResponse.json({
      images: imagePaths.sort(),
      folder: sanitizedPath,
      count: imagePaths.length,
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
