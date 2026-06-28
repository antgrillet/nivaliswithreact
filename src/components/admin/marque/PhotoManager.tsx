"use client";

import { arrayMove } from "@dnd-kit/sortable";
import SingleAssetSlot from "@/components/admin/marque/SingleAssetSlot";
import GalleryGrid from "@/components/admin/marque/GalleryGrid";

interface PhotoManagerProps {
  slug: string;
  nom: string;
  logo: string;
  mainImage: string;
  images: string[];
  setLogo: (url: string) => void;
  setMainImage: (url: string) => void;
  /** Mise à jour fonctionnelle (lit la valeur courante) — sûr face aux uploads concurrents. */
  updateImages: (updater: (prev: string[]) => string[]) => void;
}

/**
 * Orchestrateur des médias d'une marque, agnostique de React Hook Form :
 * deux emplacements à rôle unique (logo, image principale) + la galerie triable.
 * Réutilisable hors marque (images produits, etc.).
 */
export default function PhotoManager({
  slug,
  nom,
  logo,
  mainImage,
  images,
  setLogo,
  setMainImage,
  updateImages,
}: PhotoManagerProps) {
  const deleteFromStorage = async (urls: string[]) => {
    const res = await fetch("/api/blob/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ urls }),
    });
    if (!res.ok) {
      const { toast } = await import("sonner");
      toast.error("Suppression du stockage impossible.");
      throw new Error("delete failed");
    }
    updateImages((prev) => prev.filter((u) => !urls.includes(u)));
    if (urls.includes(mainImage)) setMainImage("");
    if (urls.includes(logo)) setLogo("");
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <SingleAssetSlot
          label="Logo"
          hint="Transparent de préférence"
          role="logo"
          aspect="video"
          value={logo}
          slug={slug}
          nom={nom}
          onChange={setLogo}
          onClear={() => setLogo("")}
        />
        <SingleAssetSlot
          label="Image principale"
          hint="En-tête de la page marque"
          role="mainImage"
          aspect="video"
          value={mainImage}
          slug={slug}
          nom={nom}
          onChange={setMainImage}
          onClear={() => setMainImage("")}
        />
      </div>

      <GalleryGrid
        images={images}
        mainImage={mainImage}
        slug={slug}
        nom={nom}
        onReorder={(activeId, overId) =>
          updateImages((prev) => {
            const from = prev.indexOf(activeId);
            const to = prev.indexOf(overId);
            return from < 0 || to < 0 ? prev : arrayMove(prev, from, to);
          })
        }
        onAdd={(urls) =>
          updateImages((prev) => [
            ...prev,
            ...urls.filter((u) => u && !prev.includes(u)),
          ])
        }
        onRemoveFromGallery={(urls) =>
          updateImages((prev) => prev.filter((u) => !urls.includes(u)))
        }
        onDeleteFromStorage={deleteFromStorage}
        onSetMain={setMainImage}
      />
    </div>
  );
}
