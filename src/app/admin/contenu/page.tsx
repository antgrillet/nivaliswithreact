import type { Metadata } from "next";
import ContentEditor from "@/components/admin/ContentEditor";

export const metadata: Metadata = {
  title: "Contenu",
  robots: { index: false, follow: false },
};

export default function AdminContenuPage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow">Édition</p>
        <h1 className="mt-2 font-serif text-3xl tracking-tight">
          Contenu éditorial
        </h1>
        <p className="mt-2 max-w-prose text-sm text-muted-foreground">
          Modifiez les textes et visuels de la page d’accueil et de la page
          Arpin. Les modifications sont publiées immédiatement.
        </p>
      </header>

      <ContentEditor />
    </div>
  );
}
