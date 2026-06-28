"use client";

import { useFormContext } from "react-hook-form";
import type { MarqueFormValues } from "@/lib/schemas/marque";
import { slugify } from "@/lib/slug";
import PhotoManager from "@/components/admin/marque/PhotoManager";
import NomRequiredNotice from "@/components/admin/marque/sections/NomRequiredNotice";

export default function MediaSection() {
  const { watch, setValue, getValues } = useFormContext<MarqueFormValues>();

  const nom = watch("nom") ?? "";
  const logo = watch("logo") ?? "";
  const mainImage = watch("mainImage") ?? "";
  const images = watch("images") ?? [];
  const slug = slugify(nom) || "marque";

  if (!nom.trim()) return <NomRequiredNotice what="médias" />;

  return (
    <PhotoManager
      slug={slug}
      nom={nom}
      logo={logo}
      mainImage={mainImage}
      images={images}
      setLogo={(url) => setValue("logo", url, { shouldDirty: true })}
      setMainImage={(url) => setValue("mainImage", url, { shouldDirty: true })}
      updateImages={(updater) =>
        setValue("images", updater(getValues("images") ?? []), {
          shouldDirty: true,
        })
      }
    />
  );
}
