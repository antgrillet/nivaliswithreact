"use client";

import { useQuery } from "@tanstack/react-query";
import type { MarqueData } from "@/lib/types";

async function fetchMarques(): Promise<MarqueData[]> {
  const res = await fetch("/api/cms/marques");
  if (!res.ok) {
    throw new Error("Impossible de charger les marques.");
  }
  const data = (await res.json()) as { marques: MarqueData[] };
  return data.marques ?? [];
}

/** Liste des marques (clé de cache `['marques']`). */
export function useMarques() {
  return useQuery({
    queryKey: ["marques"],
    queryFn: fetchMarques,
  });
}
