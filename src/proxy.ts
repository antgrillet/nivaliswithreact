import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  // Gérer les CORS pour les téléchargements
  if (request.nextUrl.pathname.startsWith("/api/download")) {
    const response = NextResponse.next();

    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    return response;
  }

  if (request.nextUrl.pathname.startsWith("/admin")) {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (request.nextUrl.pathname.startsWith("/api/cms")) {
    const method = request.method.toUpperCase();
    if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
      const session = await auth.api.getSession({
        headers: request.headers,
      });

      if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }
  }

  // Routes Blob sensibles : suppression et énumération réservées aux admins.
  // /api/blob/upload est volontairement exclu (handleUpload reçoit aussi un
  // webhook signé de Vercel sans cookie) ; l'auth y est vérifiée dans la route.
  if (
    request.nextUrl.pathname.startsWith("/api/blob/delete") ||
    request.nextUrl.pathname.startsWith("/api/blob/list")
  ) {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // Gérer les fichiers statiques PDF
  if (request.nextUrl.pathname.endsWith(".pdf")) {
    const response = NextResponse.next();

    response.headers.set("Content-Type", "application/pdf");
    response.headers.set(
      "Cache-Control",
      "public, max-age=31536000, immutable"
    );

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/download/:path*",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
