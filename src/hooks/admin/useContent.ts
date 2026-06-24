"use client";

import { useQuery } from "@tanstack/react-query";
import type { SiteContent } from "@/lib/types";

async function fetchContent(): Promise<SiteContent> {
  const res = await fetch("/api/cms/content");
  if (!res.ok) {
    throw new Error("Impossible de charger le contenu éditorial.");
  }
  return (await res.json()) as SiteContent;
}

/** Contenu éditorial complet (clé de cache `['content']`). */
export function useContent() {
  return useQuery({
    queryKey: ["content"],
    queryFn: fetchContent,
  });
}
