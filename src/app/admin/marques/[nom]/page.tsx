import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MarqueEditor from "@/components/admin/marque/MarqueEditor";
import { getMarqueForEdit } from "@/lib/data/marques-admin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Modifier la marque",
  robots: { index: false, follow: false },
};

type PageProps = { params: Promise<{ nom: string }> };

export default async function EditMarquePage({ params }: PageProps) {
  const { nom } = await params;
  const marque = await getMarqueForEdit(decodeURIComponent(nom));
  if (!marque) notFound();

  return <MarqueEditor mode="edit" initialMarque={marque} />;
}
