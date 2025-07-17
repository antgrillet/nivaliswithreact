import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Désactiver temporairement ESLint pour tester le build
    ignoreDuringBuilds: true,
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '/**',
        search: '',
      },
    ],
    localPatterns: [
      {
        pathname: '/img/**',
        search: '',
      },
    ],
    formats: ["image/avif", "image/webp"],
    unoptimized: true, // Désactiver l'optimisation pour les images uploadées dynamiquement
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 2678400, // 31 jours comme recommandé
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
            value: "public, max-age=0, must-revalidate",
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
