"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

async function deleteBlob(url: string): Promise<void> {
  const res = await fetch(`/api/blob/delete?url=${encodeURIComponent(url)}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    let message = "Suppression impossible.";
    try {
      const body = (await res.json()) as { error?: string };
      message = body.error || message;
    } catch {
      /* corps non JSON */
    }
    throw new Error(message);
  }
}

/** Mutations sur les blobs (suppression) : invalident `['blobs']` + toast. */
export function useBlobMutations() {
  const queryClient = useQueryClient();

  const remove = useMutation({
    mutationFn: deleteBlob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blobs"] });
      toast.success("Fichier supprimé.");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return { remove };
}
