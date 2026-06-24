"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { MarqueData } from "@/lib/types";
import type { MarqueInput } from "@/lib/schemas/marque";

/** Payload de mise à jour : partiel, mais le `nom` (clé) est requis. */
export type MarqueUpdateInput = Partial<MarqueInput> & { nom: string };

async function readError(res: Response, fallback: string): Promise<string> {
  try {
    const body = (await res.json()) as { error?: string };
    return body.error || fallback;
  } catch {
    return fallback;
  }
}

async function createMarque(input: MarqueInput): Promise<MarqueData> {
  const res = await fetch("/api/cms/marques", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error(await readError(res, "Création impossible."));
  }
  const data = (await res.json()) as { marque: MarqueData };
  return data.marque;
}

async function updateMarque(input: MarqueUpdateInput): Promise<MarqueData> {
  const res = await fetch("/api/cms/marques", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error(await readError(res, "Mise à jour impossible."));
  }
  const data = (await res.json()) as { marque: MarqueData };
  return data.marque;
}

async function deleteMarque(nom: string): Promise<void> {
  const res = await fetch(`/api/cms/marques?nom=${encodeURIComponent(nom)}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error(await readError(res, "Suppression impossible."));
  }
}

/** Mutations CRUD des marques : invalident `['marques']` et notifient via sonner. */
export function useMarqueMutations() {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["marques"] });

  const create = useMutation({
    mutationFn: createMarque,
    onSuccess: (marque) => {
      invalidate();
      toast.success(`Marque « ${marque.nom} » créée.`);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const update = useMutation({
    mutationFn: updateMarque,
    onSuccess: (marque) => {
      invalidate();
      toast.success(`Marque « ${marque.nom} » enregistrée.`);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: deleteMarque,
    onSuccess: (_data, nom) => {
      invalidate();
      toast.success(`Marque « ${nom} » supprimée.`);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return { create, update, remove };
}
