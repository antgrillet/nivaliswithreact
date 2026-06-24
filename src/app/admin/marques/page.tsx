import type { Metadata } from "next";
import MarquesTable from "@/components/admin/MarquesTable";

export const metadata: Metadata = {
  title: "Marques",
  robots: { index: false, follow: false },
};

export default function AdminMarquesPage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow">Gestion</p>
        <h1 className="mt-2 font-serif text-3xl tracking-tight">Marques</h1>
        <p className="mt-2 max-w-prose text-sm text-muted-foreground">
          Créez, modifiez et supprimez les marques. Gérez logos, image
          principale, galerie et produits phares.
        </p>
      </header>

      <MarquesTable />
    </div>
  );
}
