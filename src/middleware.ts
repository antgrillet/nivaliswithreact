import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
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
