import { put, del } from '@vercel/blob';
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

interface ContentRow {
  content: Record<string, unknown>;
}

function getPathValue(target: any, path: string[]) {
  let current = target;
  for (const key of path) {
    if (current === undefined || current === null) return undefined;
    const index = Number.isNaN(Number(key)) ? null : Number(key);
    current = index === null ? current[key] : current[index];
  }
  return current;
}

function setPathValue(target: any, path: string[], value: string) {
  let current = target;
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    const nextKey = path[i + 1];
    const index = Number.isNaN(Number(key)) ? null : Number(key);
    const nextIndex = Number.isNaN(Number(nextKey)) ? null : Number(nextKey);

    if (index !== null) {
      if (!Array.isArray(current)) {
        current = [];
      }
      if (!current[index]) {
        current[index] = nextIndex === null ? {} : [];
      }
      current = current[index];
      continue;
    }

    if (typeof current[key] !== "object" || current[key] === null) {
      current[key] = nextIndex === null ? {} : [];
    }
    current = current[key];
  }

  const lastKey = path[path.length - 1];
  const lastIndex = Number.isNaN(Number(lastKey)) ? null : Number(lastKey);
  if (lastIndex !== null && Array.isArray(current)) {
    current[lastIndex] = value;
    return;
  }
  current[lastKey] = value;
}

async function requireAuth(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  return session?.user ?? null;
}

// Helper pour verifier si une URL est une URL Vercel Blob
function isBlobUrl(url: string): boolean {
  return url.includes('blob.vercel-storage.com');
}

// POST - Ajouter/Modifier une image de contenu vers Vercel Blob
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    const { rows } = await query<ContentRow>(
      "SELECT content FROM content_sections WHERE section = $1 AND subsection = $2",
      [section, subsection]
    );
    if (rows.length === 0) {
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
    const currentData =
      rows[0].content && typeof rows[0].content === "object"
        ? rows[0].content
        : {};

    const keys = imageKey.includes(".") ? imageKey.split(".") : [imageKey];
    const existingValue = getPathValue(currentData, keys);

    if (existingValue && isBlobUrl(existingValue)) {
      try {
        await del(existingValue);
      } catch (e) {
        console.warn("Could not delete old blob:", existingValue, e);
      }
    }

    setPathValue(currentData, keys, imageUrl);

    const { rows: updatedRows } = await query<ContentRow>(
      `UPDATE content_sections
       SET content = $1::jsonb,
           updated_at = now()
       WHERE section = $2 AND subsection = $3
       RETURNING content`,
      [currentData, section, subsection]
    );

    return NextResponse.json({
      success: true,
      imageUrl,
      data: updatedRows[0]?.content ?? currentData,
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
    const user = await requireAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    const { rows } = await query<ContentRow>(
      "SELECT content FROM content_sections WHERE section = $1 AND subsection = $2",
      [section, subsection]
    );
    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Section ou subsection non trouvee" },
        { status: 404 }
      );
    }

    const currentData =
      rows[0].content && typeof rows[0].content === "object"
        ? rows[0].content
        : {};
    const keys = imageKey.includes(".") ? imageKey.split(".") : [imageKey];
    const existingValue = getPathValue(currentData, keys);

    if (existingValue && isBlobUrl(existingValue)) {
      try {
        await del(existingValue);
      } catch (e) {
        console.warn("Could not delete blob:", e);
      }
    }

    setPathValue(currentData, keys, "");

    const { rows: updatedRows } = await query<ContentRow>(
      `UPDATE content_sections
       SET content = $1::jsonb,
           updated_at = now()
       WHERE section = $2 AND subsection = $3
       RETURNING content`,
      [currentData, section, subsection]
    );

    return NextResponse.json({
      success: true,
      data: updatedRows[0]?.content ?? currentData,
    });
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'image" },
      { status: 500 }
    );
  }
}
