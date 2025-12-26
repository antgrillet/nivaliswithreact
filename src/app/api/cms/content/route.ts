import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

interface ContentRow {
  section: string;
  subsection: string;
  content: Record<string, unknown>;
}

async function buildContentObject(rows: ContentRow[]) {
  const result: Record<string, Record<string, unknown>> = {};
  for (const row of rows) {
    if (!result[row.section]) {
      result[row.section] = {};
    }
    result[row.section][row.subsection] = row.content;
  }
  return result;
}

async function requireAuth(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  return session?.user ?? null;
}

// GET - Récupérer le contenu
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section"); // homepage, arpin, etc.
    const subsection = searchParams.get("subsection"); // hero, introduction, etc.

    if (section && subsection) {
      const { rows } = await query<ContentRow>(
        "SELECT content FROM content_sections WHERE section = $1 AND subsection = $2",
        [section, subsection]
      );
      return NextResponse.json(rows[0]?.content || {});
    }
    if (section) {
      const { rows } = await query<ContentRow>(
        "SELECT subsection, content FROM content_sections WHERE section = $1",
        [section]
      );
      const result: Record<string, unknown> = {};
      for (const row of rows) {
        result[row.subsection] = row.content;
      }
      return NextResponse.json(result);
    }

    const { rows } = await query<ContentRow>(
      "SELECT section, subsection, content FROM content_sections"
    );
    return NextResponse.json(await buildContentObject(rows));
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
    const user = await requireAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { section, subsection, content: newContent } = await request.json();

    if (!section || !subsection || !newContent) {
      return NextResponse.json(
        { error: "Section, sous-section et contenu requis" },
        { status: 400 }
      );
    }

    const { rows } = await query<ContentRow>(
      `INSERT INTO content_sections (section, subsection, content)
       VALUES ($1, $2, $3::jsonb)
       ON CONFLICT (section, subsection) DO UPDATE
       SET content = EXCLUDED.content,
           updated_at = now()
       RETURNING section, subsection, content`,
      [section, subsection, newContent]
    );

    return NextResponse.json({
      success: true,
      content: rows[0]?.content ?? newContent,
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
    const user = await requireAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { section, content } = await request.json();

    if (!section || !content) {
      return NextResponse.json(
        { error: "Section et contenu requis" },
        { status: 400 }
      );
    }

    const { rows: existingRows } = await query(
      "SELECT 1 FROM content_sections WHERE section = $1 LIMIT 1",
      [section]
    );
    if (existingRows.length > 0) {
      return NextResponse.json(
        { error: "Cette section existe déjà" },
        { status: 400 }
      );
    }

    const entries = Object.entries(content);
    if (entries.length === 0) {
      return NextResponse.json(
        { error: "Contenu de section invalide" },
        { status: 400 }
      );
    }

    for (const [subsection, value] of entries) {
      await query(
        `INSERT INTO content_sections (section, subsection, content)
         VALUES ($1, $2, $3::jsonb)`,
        [section, subsection, value]
      );
    }

    return NextResponse.json({
      success: true,
      content,
    });
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la section" },
      { status: 500 }
    );
  }
}
