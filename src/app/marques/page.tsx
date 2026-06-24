import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarquesHeader from "@/components/marques/MarquesHeader";
import MarquesFilterClient from "@/components/marques/MarquesFilterClient";
import MarquesStatistics from "@/components/marques/MarquesStatistics";
import { getMarques } from "@/lib/data/marques";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Nos marques — Nivalis Les Gets",
  description:
    "Découvrez la sélection de marques premium outdoor et lifestyle de Nivalis, au cœur des Gets. Recherchez et filtrez par univers et catégorie.",
};

export default async function MarquesPage() {
  const marques = await getMarques();

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <MarquesHeader count={marques.length} />
      <MarquesFilterClient marques={marques} />
      <MarquesStatistics marques={marques} />
      <Footer />
    </main>
  );
}
