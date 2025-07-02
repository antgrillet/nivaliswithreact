import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Désactiver les vérifications d'ESLint pendant la compilation
    ignoreDuringBuilds: true,
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [],
    formats: ["image/avif", "image/webp"],
    unoptimized: true, // Désactiver l'optimisation des images pour éviter les problèmes avec les caractères spéciaux
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  typescript: {
    // Conserver les vérifications de TypeScript
    ignoreBuildErrors: false,
  },
  // Configuration pour les téléchargements sur VPS
  async headers() {
    return [
      {
        source: "/Catalogue sur Mesure Arpin 2022.pdf",
        headers: [
          {
            key: "Content-Type",
            value: "application/pdf",
          },
          {
            key: "Content-Disposition",
            value: 'attachment; filename="Catalogue sur Mesure Arpin 2022.pdf"',
          },
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/img/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  // Améliorer la gestion des fichiers statiques
  outputFileTracingExcludes: {
    "*": [
      "./**/node_modules/@swc/core-linux-x64-gnu",
      "./**/node_modules/@swc/core-linux-x64-musl",
      "./**/node_modules/esbuild-darwin-64",
      "./**/node_modules/esbuild-darwin-arm64",
      "./**/node_modules/esbuild-linux-64",
    ],
  },
};

export default nextConfig;
