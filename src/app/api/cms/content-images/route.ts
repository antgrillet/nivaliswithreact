import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { writeFile, unlink } from "fs/promises";

const CONTENT_FILE = path.join(process.cwd(), "src/data/content.json");

// POST - Ajouter/Modifier une image de contenu
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const section = formData.get("section") as string;
    const subsection = formData.get("subsection") as string;
    const imageKey = formData.get("imageKey") as string; // "main_image", "logo_image", "members.0.image", etc.
    // const arrayIndex = formData.get("arrayIndex") as string; // Unused for now

    if (!file || !section || !subsection || !imageKey) {
      return NextResponse.json(
        { error: "Fichier, section, subsection et imageKey requis" },
        { status: 400 }
      );
    }

    // Lire les données actuelles
    const data = await fs.readFile(CONTENT_FILE, "utf-8");
    const jsonData = JSON.parse(data);

    // Vérifier que la section/subsection existe
    if (!jsonData[section] || !jsonData[section][subsection]) {
      return NextResponse.json(
        { error: "Section ou subsection non trouvée" },
        { status: 404 }
      );
    }

    // Préparer le fichier
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${file.name}`;

    // Déterminer le dossier de destination
    let uploadDir: string;
    if (section === "homepage" && subsection === "team") {
      uploadDir = path.join(process.cwd(), "public", "img", "team");
    } else if (section === "arpin") {
      uploadDir = path.join(process.cwd(), "public", "img", "Arpin");
    } else {
      uploadDir = path.join(
        process.cwd(),
        "public",
        "img",
        section,
        subsection
      );
    }

    // Créer le dossier si nécessaire
    await fs.mkdir(uploadDir, { recursive: true });

    // Sauvegarder le fichier
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    // Construire l'URL relative
    const imageUrl = filePath
      .replace(path.join(process.cwd(), "public"), "")
      .replace(/\\/g, "/");

    // Mettre à jour les données selon le type d'image
    const currentData = jsonData[section][subsection];

    if (imageKey.includes(".")) {
      // Gestion des objets imbriqués (ex: "members.0.image")
      const keys = imageKey.split(".");
      let target = currentData;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        const nextKey = keys[i + 1];

        if (!isNaN(parseInt(nextKey))) {
          // C'est un index de tableau
          target = target[key][parseInt(nextKey)];
          i++; // Skip next iteration
        } else {
          target = target[key];
        }
      }

      // Supprimer l'ancienne image si elle existe
      const lastKey = keys[keys.length - 1];
      if (target[lastKey]) {
        const oldImagePath = path.join(
          process.cwd(),
          "public",
          target[lastKey]
        );
        try {
          await unlink(oldImagePath);
        } catch (e) {
          console.error("Erreur suppression ancienne image:", e);
        }
      }

      target[lastKey] = imageUrl;
    } else {
      // Gestion simple
      if (currentData[imageKey]) {
        const oldImagePath = path.join(
          process.cwd(),
          "public",
          currentData[imageKey]
        );
        try {
          await unlink(oldImagePath);
        } catch (e) {
          console.error("Erreur suppression ancienne image:", e);
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

    // Lire les données actuelles
    const data = await fs.readFile(CONTENT_FILE, "utf-8");
    const jsonData = JSON.parse(data);

    // Vérifier que la section/subsection existe
    if (!jsonData[section] || !jsonData[section][subsection]) {
      return NextResponse.json(
        { error: "Section ou subsection non trouvée" },
        { status: 404 }
      );
    }

    const currentData = jsonData[section][subsection];

    if (imageKey.includes(".")) {
      // Gestion des objets imbriqués
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
      if (target[lastKey]) {
        const imagePath = path.join(process.cwd(), "public", target[lastKey]);
        try {
          await unlink(imagePath);
        } catch (e) {
          console.error("Erreur suppression fichier:", e);
        }
        target[lastKey] = "";
      }
    } else {
      // Gestion simple
      if (currentData[imageKey]) {
        const imagePath = path.join(
          process.cwd(),
          "public",
          currentData[imageKey]
        );
        try {
          await unlink(imagePath);
        } catch (e) {
          console.error("Erreur suppression fichier:", e);
        }
        currentData[imageKey] = "";
      }
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
