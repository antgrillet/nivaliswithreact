import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

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

// GET - Récupérer toutes les marques ou une marque spécifique
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const nom = searchParams.get("nom");

    const data = await fs.readFile(DATA_FILE, "utf-8");
    const { marques } = JSON.parse(data);

    if (nom) {
      const marque = marques.find((m: Marque) => m.nom === nom);
      if (!marque) {
        return NextResponse.json(
          { error: "Marque non trouvée" },
          { status: 404 }
        );
      }
      return NextResponse.json(marque);
    }

    return NextResponse.json({ marques });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la lecture des données" },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle marque
export async function POST(request: NextRequest) {
  try {
    const newMarque = await request.json();

    const data = await fs.readFile(DATA_FILE, "utf-8");
    const jsonData = JSON.parse(data);

    // Vérifier si la marque existe déjà
    if (jsonData.marques.find((m: Marque) => m.nom === newMarque.nom)) {
      return NextResponse.json(
        { error: "Cette marque existe déjà" },
        { status: 400 }
      );
    }

    jsonData.marques.push(newMarque);

    await fs.writeFile(DATA_FILE, JSON.stringify(jsonData, null, 2));

    return NextResponse.json({ success: true, marque: newMarque });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la création de la marque" },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour une marque existante
export async function PUT(request: NextRequest) {
  try {
    const updatedMarque = await request.json();

    const data = await fs.readFile(DATA_FILE, "utf-8");
    const jsonData = JSON.parse(data);

    const index = jsonData.marques.findIndex(
      (m: Marque) => m.nom === updatedMarque.nom
    );

    if (index === -1) {
      return NextResponse.json(
        { error: "Marque non trouvée" },
        { status: 404 }
      );
    }

    // Fusionner les anciennes données avec les nouvelles
    jsonData.marques[index] = {
      ...jsonData.marques[index],
      ...updatedMarque,
    };

    await fs.writeFile(DATA_FILE, JSON.stringify(jsonData, null, 2));

    return NextResponse.json({
      success: true,
      marque: jsonData.marques[index],
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la marque" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une marque
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const nom = searchParams.get("nom");

    if (!nom) {
      return NextResponse.json(
        { error: "Nom de la marque requis" },
        { status: 400 }
      );
    }

    const data = await fs.readFile(DATA_FILE, "utf-8");
    const jsonData = JSON.parse(data);

    const index = jsonData.marques.findIndex((m: Marque) => m.nom === nom);

    if (index === -1) {
      return NextResponse.json(
        { error: "Marque non trouvée" },
        { status: 404 }
      );
    }

    // Sauvegarder la marque supprimée
    const deletedMarque = jsonData.marques[index];

    // Supprimer la marque
    jsonData.marques.splice(index, 1);

    await fs.writeFile(DATA_FILE, JSON.stringify(jsonData, null, 2));

    return NextResponse.json({
      success: true,
      deleted: deletedMarque,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la marque" },
      { status: 500 }
    );
  }
}
