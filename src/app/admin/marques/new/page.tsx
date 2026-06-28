import type { Metadata } from "next";
import MarqueEditor from "@/components/admin/marque/MarqueEditor";

export const metadata: Metadata = {
  title: "Nouvelle marque",
  robots: { index: false, follow: false },
};

export default function NewMarquePage() {
  return <MarqueEditor mode="create" />;
}
