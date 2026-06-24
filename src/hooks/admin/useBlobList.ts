"use client";

import { useQuery } from "@tanstack/react-query";

export interface BlobItem {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: string;
}

interface BlobListResponse {
  blobs: BlobItem[];
  hasMore: boolean;
  cursor?: string;
}

async function fetchBlobs(prefix: string): Promise<BlobItem[]> {
  const params = new URLSearchParams();
  if (prefix) params.set("prefix", prefix);
  params.set("limit", "1000");

  const res = await fetch(`/api/blob/list?${params.toString()}`);
  if (!res.ok) {
    throw new Error("Impossible de charger la médiathèque.");
  }
  const data = (await res.json()) as BlobListResponse;
  return data.blobs ?? [];
}

/** Liste des blobs Vercel (clé de cache `['blobs', prefix]`). */
export function useBlobList(prefix = "") {
  return useQuery({
    queryKey: ["blobs", prefix],
    queryFn: () => fetchBlobs(prefix),
  });
}
