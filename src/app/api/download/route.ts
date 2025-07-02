import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("file");

    if (!filename) {
      return NextResponse.json(
        { error: "Nom de fichier requis" },
        { status: 400 }
      );
    }

    // Sécurité : empêcher l'accès aux fichiers en dehors du dossier public
    const safePath = filename.replace(/\.\./g, "");
    const filePath = path.join(process.cwd(), "public", safePath);

    // Vérifier que le fichier existe
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: "Fichier non trouvé" },
        { status: 404 }
      );
    }

    // Lire le fichier
    const fileBuffer = fs.readFileSync(filePath);
    const stats = fs.statSync(filePath);

    // Déterminer le type MIME
    const ext = path.extname(filename).toLowerCase();
    let contentType = "application/octet-stream";

    switch (ext) {
      case ".pdf":
        contentType = "application/pdf";
        break;
      case ".jpg":
      case ".jpeg":
        contentType = "image/jpeg";
        break;
      case ".png":
        contentType = "image/png";
        break;
      case ".gif":
        contentType = "image/gif";
        break;
      case ".webp":
        contentType = "image/webp";
        break;
      case ".avif":
        contentType = "image/avif";
        break;
      case ".svg":
        contentType = "image/svg+xml";
        break;
      case ".mp4":
        contentType = "video/mp4";
        break;
    }

    // Créer la réponse avec les bons headers
    const response = new NextResponse(fileBuffer as any);

    response.headers.set("Content-Type", contentType);
    response.headers.set("Content-Length", stats.size.toString());
    response.headers.set(
      "Content-Disposition",
      `attachment; filename="${path.basename(filename)}"`
    );
    response.headers.set(
      "Cache-Control",
      "public, max-age=31536000, immutable"
    );
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;
  } catch (error) {
    console.error("Erreur téléchargement:", error);
    return NextResponse.json(
      { error: "Erreur lors du téléchargement" },
      { status: 500 }
    );
  }
}
