"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ContentValue } from "@/lib/types";

export interface ContentUpdatePayload {
  section: string;
  subsection: string;
  content: ContentValue;
}

async function updateContent(payload: ContentUpdatePayload): Promise<void> {
  const res = await fetch("/api/cms/content", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let message = "Enregistrement impossible.";
    try {
      const body = (await res.json()) as { error?: string };
      message = body.error || message;
    } catch {
      /* corps non JSON */
    }
    throw new Error(message);
  }
}

/** Mutation d'une sous-section éditoriale : invalide `['content']` + toast. */
export function useContentMutations() {
  const queryClient = useQueryClient();

  const save = useMutation({
    mutationFn: updateContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content"] });
      toast.success("Contenu enregistré.");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return { save };
}
