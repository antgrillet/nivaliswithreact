import { put, del } from '@vercel/blob';
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const CONTENT_FILE = path.join(process.cwd(), "src/data/content.json");

// Helper pour verifier si une URL est une URL Vercel Blob
function isBlobUrl(url: string): boolean {
  return url.includes('blob.vercel-storage.com');
}

// POST - Ajouter/Modifier une image de contenu vers Vercel Blob
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const section = formData.get("section") as string;
    const subsection = formData.get("subsection") as string;
    const imageKey = formData.get("imageKey") as string;

    if (!file || !section || !subsection || !imageKey) {
      return NextResponse.json(
        { error: "Fichier, section, subsection et imageKey requis" },
        { status: 400 }
      );
    }

    // Lire les donnees actuelles
    const data = await fs.readFile(CONTENT_FILE, "utf-8");
    const jsonData = JSON.parse(data);

    // Verifier que la section/subsection existe
    if (!jsonData[section] || !jsonData[section][subsection]) {
      return NextResponse.json(
        { error: "Section ou subsection non trouvee" },
        { status: 404 }
      );
    }

    // Upload vers Vercel Blob
    const blob = await put(
      `content/${section}/${subsection}/${file.name}`,
      file,
      {
        access: 'public',
        addRandomSuffix: true,
      }
    );

    const imageUrl = blob.url;
    const currentData = jsonData[section][subsection];

    if (imageKey.includes(".")) {
      // Gestion des objets imbriques (ex: "members.0.image")
      const keys = imageKey.split(".");
      let target = currentData;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        const nextKey = keys[i + 1];

        if (!isNaN(parseInt(nextKey))) {
          target = target[key][parseInt(nextKey)];
          i++;
        } else {
          target = target[key];
        }
      }

      // Supprimer l'ancienne image si elle existe sur Vercel Blob
      const lastKey = keys[keys.length - 1];
      if (target[lastKey] && isBlobUrl(target[lastKey])) {
        try {
          await del(target[lastKey]);
        } catch (e) {
          console.warn("Could not delete old blob:", target[lastKey], e);
        }
      }

      target[lastKey] = imageUrl;
    } else {
      // Gestion simple
      if (currentData[imageKey] && isBlobUrl(currentData[imageKey])) {
        try {
          await del(currentData[imageKey]);
        } catch (e) {
          console.warn("Could not delete old blob:", currentData[imageKey], e);
        }
      }
      currentData[imageKey] = imageUrl;
    }

    // Sauvegarder les changements
    await fs.writeFile(CONTENT_FILE, JSON.stringify(jsonData, null, 2));

    return NextResponse.json({
      success: true,
      imageUrl,
      data: jsonData[section][subsection],
    });
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'upload de l'image" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une image de contenu
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");
    const subsection = searchParams.get("subsection");
    const imageKey = searchParams.get("imageKey");

    if (!section || !subsection || !imageKey) {
      return NextResponse.json(
        { error: "Section, subsection et imageKey requis" },
        { status: 400 }
      );
    }

    // Lire les donnees actuelles
    const data = await fs.readFile(CONTENT_FILE, "utf-8");
    const jsonData = JSON.parse(data);

    // Verifier que la section/subsection existe
    if (!jsonData[section] || !jsonData[section][subsection]) {
      return NextResponse.json(
        { error: "Section ou subsection non trouvee" },
        { status: 404 }
      );
    }

    const currentData = jsonData[section][subsection];

    if (imageKey.includes(".")) {
      // Gestion des objets imbriques
      const keys = imageKey.split(".");
      let target = currentData;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        const nextKey = keys[i + 1];

        if (!isNaN(parseInt(nextKey))) {
          target = target[key][parseInt(nextKey)];
          i++;
        } else {
          target = target[key];
        }
      }

      const lastKey = keys[keys.length - 1];
      if (target[lastKey] && isBlobUrl(target[lastKey])) {
        try {
          await del(target[lastKey]);
        } catch (e) {
          console.warn("Could not delete blob:", e);
        }
      }
      target[lastKey] = "";
    } else {
      // Gestion simple
      if (currentData[imageKey] && isBlobUrl(currentData[imageKey])) {
        try {
          await del(currentData[imageKey]);
        } catch (e) {
          console.warn("Could not delete blob:", e);
        }
      }
      currentData[imageKey] = "";
    }

    // Sauvegarder les changements
    await fs.writeFile(CONTENT_FILE, JSON.stringify(jsonData, null, 2));

    return NextResponse.json({
      success: true,
      data: jsonData[section][subsection],
    });
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'image" },
      { status: 500 }
    );
  }
}
