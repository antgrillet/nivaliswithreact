import type { Metadata } from "next";
import MediaLibrary from "@/components/admin/MediaLibrary";

export const metadata: Metadata = {
  title: "Médiathèque",
  robots: { index: false, follow: false },
};

export default function AdminMediathequePage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow">Médias</p>
        <h1 className="mt-2 font-serif text-3xl tracking-tight">Médiathèque</h1>
        <p className="mt-2 max-w-prose text-sm text-muted-foreground">
          Téléversez de nouvelles images et gérez les fichiers stockés sur
          Vercel Blob.
        </p>
      </header>

      <MediaLibrary />
    </div>
  );
}
