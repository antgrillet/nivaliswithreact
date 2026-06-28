"use client";

import { useFormContext } from "react-hook-form";
import type { MarqueFormValues } from "@/lib/schemas/marque";
import { slugify } from "@/lib/slug";
import VideoList from "@/components/admin/marque/VideoList";
import NomRequiredNotice from "@/components/admin/marque/sections/NomRequiredNotice";

export default function VideosSection() {
  const { watch, setValue, getValues } = useFormContext<MarqueFormValues>();

  const nom = watch("nom") ?? "";
  const videos = watch("videos") ?? [];
  const slug = slugify(nom) || "marque";

  if (!nom.trim()) return <NomRequiredNotice what="vidéos" />;

  return (
    <VideoList
      videos={videos}
      slug={slug}
      nom={nom}
      updateVideos={(updater) =>
        setValue("videos", updater(getValues("videos") ?? []), {
          shouldDirty: true,
        })
      }
    />
  );
}
