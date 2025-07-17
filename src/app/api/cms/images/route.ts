import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { writeFile, unlink } from "fs/promises";

interface Marque {
  nom: string;
  description: string;
  description_fr?: string;
  description_en?: string;
  imageFolder: string;
  mainImage?: string;
  logo?: string;
  images?: string[];
  videos?: string[];
  tags?: string[];
  type?: string;
}

const DATA_FILE = path.join(process.cwd(), "src/data/marque.json");

// POST - Ajouter une image à une marque
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const marqueName = formData.get("marque") as string;
    const action = formData.get("action") as string; // "add", "replace", "mainImage", "logo"
    const replaceIndex = formData.get("replaceIndex") as string;

    if (!file || !marqueName || !action) {
      return NextResponse.json(
        { error: "Fichier, marque et action requis" },
        { status: 400 }
      );
    }

    // Lire les données actuelles
    const data = await fs.readFile(DATA_FILE, "utf-8");
    const jsonData = JSON.parse(data);

    // Trouver la marque
    const marqueIndex = jsonData.marques.findIndex(
      (m: Marque) => m.nom === marqueName
    );
    if (marqueIndex === -1) {
      return NextResponse.json(
        { error: "Marque non trouvée" },
        { status: 404 }
      );
    }

    // Préparer le fichier
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${file.name}`;
    const uploadDir = path.join(
      process.cwd(),
      "public",
      jsonData.marques[marqueIndex].imageFolder
    );

    // Créer le dossier si nécessaire
    await fs.mkdir(uploadDir, { recursive: true });

    // Sauvegarder le fichier
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    const imageUrl = `${jsonData.marques[marqueIndex].imageFolder}${fileName}`;

    // Mettre à jour les données selon l'action
    switch (action) {
      case "add":
        if (!jsonData.marques[marqueIndex].images) {
          jsonData.marques[marqueIndex].images = [];
        }
        jsonData.marques[marqueIndex].images.push(imageUrl);
        break;

      case "replace":
        if (replaceIndex && jsonData.marques[marqueIndex].images) {
          const index = parseInt(replaceIndex);
          if (
            index >= 0 &&
            index < jsonData.marques[marqueIndex].images.length
          ) {
            // Supprimer l'ancienne image
            const oldImage = jsonData.marques[marqueIndex].images[index];
            const oldImagePath = path.join(process.cwd(), "public", oldImage);
            try {
              await unlink(oldImagePath);
            } catch {
              // L'image n'existe peut-être plus
            }
            jsonData.marques[marqueIndex].images[index] = imageUrl;
          }
        }
        break;

      case "mainImage":
        // Supprimer l'ancienne image principale si elle existe
        if (jsonData.marques[marqueIndex].mainImage) {
          const oldMainPath = path.join(
            process.cwd(),
            "public",
            jsonData.marques[marqueIndex].mainImage
          );
          try {
            await unlink(oldMainPath);
          } catch {
            // L'image n'existe peut-être plus
          }
        }
        jsonData.marques[marqueIndex].mainImage = imageUrl;
        break;

      case "logo":
        // Supprimer l'ancien logo si il existe
        if (jsonData.marques[marqueIndex].logo) {
          const oldLogoPath = path.join(
            process.cwd(),
            "public",
            jsonData.marques[marqueIndex].logo
          );
          try {
            await unlink(oldLogoPath);
          } catch {
            // Le logo n'existe peut-être plus
          }
        }
        jsonData.marques[marqueIndex].logo = imageUrl;
        break;
    }

    // Sauvegarder les changements
    await fs.writeFile(DATA_FILE, JSON.stringify(jsonData, null, 2));

    return NextResponse.json({
      success: true,
      imageUrl,
      marque: jsonData.marques[marqueIndex],
    });
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'upload de l'image" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une image d'une marque
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const marqueName = searchParams.get("marque");
    const imageUrl = searchParams.get("imageUrl");
    const imageType = searchParams.get("type"); // "gallery", "main", "logo"

    if (!marqueName || (!imageUrl && imageType !== "all")) {
      return NextResponse.json(
        { error: "Marque et URL de l'image requis" },
        { status: 400 }
      );
    }

    // Lire les données actuelles
    const data = await fs.readFile(DATA_FILE, "utf-8");
    const jsonData = JSON.parse(data);

    // Trouver la marque
    const marqueIndex = jsonData.marques.findIndex(
      (m: Marque) => m.nom === marqueName
    );
    if (marqueIndex === -1) {
      return NextResponse.json(
        { error: "Marque non trouvée" },
        { status: 404 }
      );
    }

    const marque = jsonData.marques[marqueIndex];

    // Supprimer selon le type
    switch (imageType) {
      case "gallery":
        if (marque.images && imageUrl) {
          const imageIndex = marque.images.indexOf(imageUrl);
          if (imageIndex > -1) {
            marque.images.splice(imageIndex, 1);
            // Supprimer le fichier physique
            const imagePath = path.join(process.cwd(), "public", imageUrl);
            try {
              await unlink(imagePath);
            } catch (e) {
              console.error("Erreur suppression fichier:", e);
            }
          }
        }
        break;

      case "main":
        if (marque.mainImage) {
          const imagePath = path.join(
            process.cwd(),
            "public",
            marque.mainImage
          );
          try {
            await unlink(imagePath);
          } catch (e) {
            console.error("Erreur suppression fichier:", e);
          }
          marque.mainImage = "";
        }
        break;

      case "logo":
        if (marque.logo) {
          const logoPath = path.join(process.cwd(), "public", marque.logo);
          try {
            await unlink(logoPath);
          } catch (e) {
            console.error("Erreur suppression fichier:", e);
          }
          marque.logo = "";
        }
        break;

      case "all":
        // Supprimer toutes les images
        const allImages = [
          ...(marque.images || []),
          marque.mainImage,
          marque.logo,
        ].filter((img) => img);

        for (const img of allImages) {
          const imgPath = path.join(process.cwd(), "public", img);
          try {
            await unlink(imgPath);
          } catch (e) {
            console.error("Erreur suppression fichier:", e);
          }
        }

        marque.images = [];
        marque.mainImage = "";
        marque.logo = "";
        break;
    }

    // Sauvegarder les changements
    await fs.writeFile(DATA_FILE, JSON.stringify(jsonData, null, 2));

    return NextResponse.json({
      success: true,
      marque: jsonData.marques[marqueIndex],
    });
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'image" },
      { status: 500 }
    );
  }
}

// GET - Lister toutes les images d'une marque
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const marqueName = searchParams.get("marque");

    if (!marqueName) {
      return NextResponse.json(
        { error: "Nom de la marque requis" },
        { status: 400 }
      );
    }

    // Lire les données
    const data = await fs.readFile(DATA_FILE, "utf-8");
    const jsonData = JSON.parse(data);

    // Trouver la marque
    const marque = jsonData.marques.find((m: Marque) => m.nom === marqueName);
    if (!marque) {
      return NextResponse.json(
        { error: "Marque non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      marque: marque.nom,
      logo: marque.logo || null,
      mainImage: marque.mainImage || null,
      images: marque.images || [],
      videos: marque.videos || [],
    });
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des images" },
      { status: 500 }
    );
  }
}
