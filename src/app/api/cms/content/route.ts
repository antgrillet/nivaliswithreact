import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const CONTENT_FILE = path.join(process.cwd(), "src/data/content.json");

// GET - Récupérer le contenu
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section"); // homepage, arpin, etc.
    const subsection = searchParams.get("subsection"); // hero, introduction, etc.

    const data = await fs.readFile(CONTENT_FILE, "utf-8");
    const content = JSON.parse(data);

    if (section && subsection) {
      return NextResponse.json(content[section]?.[subsection] || {});
    } else if (section) {
      return NextResponse.json(content[section] || {});
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error("Erreur lecture contenu:", error);
    return NextResponse.json(
      { error: "Erreur lors de la lecture du contenu" },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour le contenu
export async function PUT(request: NextRequest) {
  try {
    const { section, subsection, content: newContent } = await request.json();

    if (!section || !subsection || !newContent) {
      return NextResponse.json(
        { error: "Section, sous-section et contenu requis" },
        { status: 400 }
      );
    }

    // Lire le contenu actuel
    const data = await fs.readFile(CONTENT_FILE, "utf-8");
    const contentData = JSON.parse(data);

    // S'assurer que la structure existe
    if (!contentData[section]) {
      contentData[section] = {};
    }

    // Mettre à jour la sous-section
    contentData[section][subsection] = newContent;

    // Sauvegarder
    await fs.writeFile(CONTENT_FILE, JSON.stringify(contentData, null, 2));

    return NextResponse.json({
      success: true,
      content: contentData[section][subsection],
    });
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du contenu" },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle section
export async function POST(request: NextRequest) {
  try {
    const { section, content } = await request.json();

    if (!section || !content) {
      return NextResponse.json(
        { error: "Section et contenu requis" },
        { status: 400 }
      );
    }

    // Lire le contenu actuel
    const data = await fs.readFile(CONTENT_FILE, "utf-8");
    const contentData = JSON.parse(data);

    // Vérifier si la section existe déjà
    if (contentData[section]) {
      return NextResponse.json(
        { error: "Cette section existe déjà" },
        { status: 400 }
      );
    }

    // Ajouter la nouvelle section
    contentData[section] = content;

    // Sauvegarder
    await fs.writeFile(CONTENT_FILE, JSON.stringify(contentData, null, 2));

    return NextResponse.json({
      success: true,
      content: contentData[section],
    });
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la section" },
      { status: 500 }
    );
  }
}
