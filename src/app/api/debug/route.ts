import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * API de débogage pour vérifier la structure des dossiers d'images
 * Cela aide à comprendre comment les chemins sont résolus dans l'application
 */
export async function GET(request: NextRequest) {
  const publicDir = path.join(process.cwd(), "public");
  const imgDir = path.join(publicDir, "img");

  try {
    // Vérification de l'existence des dossiers principaux
    const publicExists = fs.existsSync(publicDir);
    const imgExists = fs.existsSync(imgDir);

    // Récupération des dossiers de marques dans /public/img
    let brandFolders = [];
    if (imgExists) {
      brandFolders = fs
        .readdirSync(imgDir)
        .filter((item) => fs.statSync(path.join(imgDir, item)).isDirectory())
        .map((folder) => ({
          name: folder,
          path: `/img/${folder}/`,
          exists: fs.existsSync(path.join(imgDir, folder)),
          imageCount: fs.existsSync(path.join(imgDir, folder))
            ? fs.readdirSync(path.join(imgDir, folder)).filter((file) => {
                const ext = path.extname(file).toLowerCase();
                const fileName = file.toLowerCase();
                // Exclure les fichiers avec "logo" dans leur nom
                return (
                  [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext) &&
                  !fileName.includes("logo")
                );
              }).length
            : 0,
        }));
    }

    return NextResponse.json({
      env: process.env.NODE_ENV,
      cwd: process.cwd(),
      paths: {
        publicDir,
        imgDir,
        publicExists,
        imgExists,
      },
      brandFolders,
    });
  } catch (error) {
    console.error("Erreur lors du débogage:", error);
    return NextResponse.json(
      {
        error: "Erreur serveur lors du débogage",
        message: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
