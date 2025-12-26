import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

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
  website?: string;
  histoire?: string;
  contact?: Record<string, unknown>;
  produits?: Record<string, unknown>[] | null;
}

interface MarqueRow {
  nom: string;
  description: string;
  description_fr: string | null;
  description_en: string | null;
  image_folder: string | null;
  main_image: string | null;
  logo: string | null;
  images: string[] | null;
  videos: string[] | null;
  tags: string[] | null;
  type: string | null;
  website: string | null;
  histoire: string | null;
  contact: Record<string, unknown> | null;
  produits: Record<string, unknown>[] | null;
}

function mapRow(row: MarqueRow): Marque {
  return {
    nom: row.nom,
    description: row.description,
    description_fr: row.description_fr ?? undefined,
    description_en: row.description_en ?? undefined,
    imageFolder: row.image_folder ?? "",
    mainImage: row.main_image ?? "",
    logo: row.logo ?? "",
    images: row.images ?? [],
    videos: row.videos ?? [],
    tags: row.tags ?? [],
    type: row.type ?? "",
    website: row.website ?? undefined,
    histoire: row.histoire ?? undefined,
    contact: row.contact ?? undefined,
    produits: row.produits ?? undefined,
  };
}

async function requireAuth(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  return session?.user ?? null;
}

// GET - Récupérer toutes les marques ou une marque spécifique
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const nom = searchParams.get("nom");

    if (nom) {
      const { rows } = await query<MarqueRow>(
        "SELECT * FROM marques WHERE nom = $1",
        [nom]
      );
      if (rows.length === 0) {
        return NextResponse.json(
          { error: "Marque non trouvée" },
          { status: 404 }
        );
      }
      return NextResponse.json(mapRow(rows[0]));
    }

    const { rows } = await query<MarqueRow>("SELECT * FROM marques ORDER BY nom");
    return NextResponse.json({ marques: rows.map(mapRow) });
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
    const user = await requireAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const newMarque = await request.json();

    const existing = await query("SELECT 1 FROM marques WHERE nom = $1", [
      newMarque.nom,
    ]);
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: "Cette marque existe déjà" },
        { status: 400 }
      );
    }

    const { rows } = await query<MarqueRow>(
      `INSERT INTO marques (
        nom,
        description,
        description_fr,
        description_en,
        image_folder,
        main_image,
        logo,
        tags,
        type,
        images,
        videos,
        website,
        histoire,
        contact,
        produits
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8::text[], $9, $10::text[], $11::text[],
        $12, $13, $14::jsonb, $15::jsonb
      )
      RETURNING *`,
      [
        newMarque.nom,
        newMarque.description,
        newMarque.description_fr ?? null,
        newMarque.description_en ?? null,
        newMarque.imageFolder ?? null,
        newMarque.mainImage ?? null,
        newMarque.logo ?? null,
        newMarque.tags ?? [],
        newMarque.type ?? null,
        newMarque.images ?? [],
        newMarque.videos ?? [],
        newMarque.website ?? null,
        newMarque.histoire ?? null,
        newMarque.contact ?? null,
        newMarque.produits ?? null,
      ]
    );

    return NextResponse.json({ success: true, marque: mapRow(rows[0]) });
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
    const user = await requireAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updatedMarque = await request.json();

    const { rows: existingRows } = await query<MarqueRow>(
      "SELECT * FROM marques WHERE nom = $1",
      [updatedMarque.nom]
    );
    if (existingRows.length === 0) {
      return NextResponse.json(
        { error: "Marque non trouvée" },
        { status: 404 }
      );
    }

    const existing = mapRow(existingRows[0]);
    const has = (key: keyof Marque) =>
      Object.prototype.hasOwnProperty.call(updatedMarque, key);

    const merged: Marque = {
      nom: existing.nom,
      description: has("description")
        ? updatedMarque.description
        : existing.description,
      description_fr: has("description_fr")
        ? updatedMarque.description_fr
        : existing.description_fr,
      description_en: has("description_en")
        ? updatedMarque.description_en
        : existing.description_en,
      imageFolder: has("imageFolder")
        ? updatedMarque.imageFolder
        : existing.imageFolder,
      mainImage: has("mainImage")
        ? updatedMarque.mainImage
        : existing.mainImage,
      logo: has("logo") ? updatedMarque.logo : existing.logo,
      tags: has("tags") ? updatedMarque.tags : existing.tags,
      type: has("type") ? updatedMarque.type : existing.type,
      images: has("images") ? updatedMarque.images : existing.images,
      videos: has("videos") ? updatedMarque.videos : existing.videos,
      website: has("website") ? updatedMarque.website : existing.website,
      histoire: has("histoire") ? updatedMarque.histoire : existing.histoire,
      contact: has("contact") ? updatedMarque.contact : existing.contact,
      produits: has("produits") ? updatedMarque.produits : existing.produits,
    };

    const { rows } = await query<MarqueRow>(
      `UPDATE marques SET
        description = $1,
        description_fr = $2,
        description_en = $3,
        image_folder = $4,
        main_image = $5,
        logo = $6,
        tags = $7::text[],
        type = $8,
        images = $9::text[],
        videos = $10::text[],
        website = $11,
        histoire = $12,
        contact = $13::jsonb,
        produits = $14::jsonb,
        updated_at = now()
      WHERE nom = $15
      RETURNING *`,
      [
        merged.description,
        merged.description_fr ?? null,
        merged.description_en ?? null,
        merged.imageFolder ?? null,
        merged.mainImage ?? null,
        merged.logo ?? null,
        merged.tags ?? [],
        merged.type ?? null,
        merged.images ?? [],
        merged.videos ?? [],
        merged.website ?? null,
        merged.histoire ?? null,
        merged.contact ?? null,
        merged.produits ?? null,
        merged.nom,
      ]
    );

    return NextResponse.json({
      success: true,
      marque: mapRow(rows[0]),
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
    const user = await requireAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const nom = searchParams.get("nom");

    if (!nom) {
      return NextResponse.json(
        { error: "Nom de la marque requis" },
        { status: 400 }
      );
    }

    const { rows } = await query<MarqueRow>(
      "SELECT * FROM marques WHERE nom = $1",
      [nom]
    );
    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Marque non trouvée" },
        { status: 404 }
      );
    }
    const deletedMarque = mapRow(rows[0]);
    await query("DELETE FROM marques WHERE nom = $1", [nom]);

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
