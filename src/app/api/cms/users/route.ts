import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { query } from "@/lib/db";

export const runtime = "nodejs";

interface SessionUser {
  id: string;
  role?: string | null;
}

async function requireAdmin(
  request: NextRequest
): Promise<SessionUser | null> {
  const session = await auth.api.getSession({ headers: request.headers });
  return (session?.user as SessionUser | undefined) ?? null;
}

// GET — liste des accès (comptes admin)
export async function GET(request: NextRequest) {
  const user = await requireAdmin(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = (await auth.api.listUsers({
      query: { limit: 200 },
      headers: request.headers,
    })) as { users?: unknown[] };
    return NextResponse.json({ users: result.users ?? [] });
  } catch {
    return NextResponse.json(
      { error: "Lecture des accès impossible." },
      { status: 500 }
    );
  }
}

// POST — créer un accès (identifiant + mot de passe)
export async function POST(request: NextRequest) {
  const user = await requireAdmin(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { username, password, name } = await request.json();
    const clean = String(username ?? "").trim();
    const pwd = String(password ?? "");

    if (clean.length < 3) {
      return NextResponse.json(
        { error: "L'identifiant doit faire au moins 3 caractères." },
        { status: 400 }
      );
    }
    if (pwd.length < 8) {
      return NextResponse.json(
        { error: "Le mot de passe doit faire au moins 8 caractères." },
        { status: 400 }
      );
    }

    const slug = clean.toLowerCase().replace(/[^a-z0-9._-]/g, "");
    const email = `${slug || "user"}@local.invalid`;

    const created = (await auth.api.createUser({
      body: {
        email,
        password: pwd,
        name: (name && String(name).trim()) || clean,
        role: "admin",
        data: { username: clean, displayUsername: clean },
      },
      headers: request.headers,
    })) as { user?: { id?: string }; id?: string };

    // Filet de sécurité : garantit que les champs du plugin `username`
    // sont bien renseignés pour autoriser la connexion par identifiant.
    const newId = created.user?.id ?? created.id;
    if (newId) {
      await query(
        `UPDATE "user" SET "username" = $1, "displayUsername" = $2 WHERE id = $3 AND ("username" IS NULL OR "username" = '')`,
        [clean, clean, newId]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Création de l'accès impossible.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// DELETE — supprimer un accès (?userId=...)
export async function DELETE(request: NextRequest) {
  const user = await requireAdmin(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "Accès introuvable." }, { status: 400 });
    }
    if (userId === user.id) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas supprimer votre propre accès." },
        { status: 400 }
      );
    }
    await auth.api.removeUser({
      body: { userId },
      headers: request.headers,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Suppression impossible.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
