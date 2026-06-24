"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface AccessUser {
  id: string;
  username?: string | null;
  displayUsername?: string | null;
  name?: string | null;
  role?: string | null;
  createdAt?: string;
}

async function readError(res: Response, fallback: string): Promise<string> {
  try {
    const body = (await res.json()) as { error?: string };
    return body.error || fallback;
  } catch {
    return fallback;
  }
}

/** Liste des accès admin. */
export function useAccessUsers() {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: async (): Promise<AccessUser[]> => {
      const res = await fetch("/api/cms/users", { credentials: "include" });
      if (!res.ok) throw new Error(await readError(res, "Lecture impossible."));
      const data = (await res.json()) as { users: AccessUser[] };
      return data.users ?? [];
    },
  });
}

export interface CreateAccessInput {
  username: string;
  password: string;
  name?: string;
}

/** Mutations sur les accès : création / suppression. */
export function useAccessMutations() {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-users"] });

  const create = useMutation({
    mutationFn: async (input: CreateAccessInput) => {
      const res = await fetch("/api/cms/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error(await readError(res, "Création impossible."));
    },
    onSuccess: () => {
      invalidate();
      toast.success("Accès créé.");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (userId: string) => {
      const res = await fetch(
        `/api/cms/users?userId=${encodeURIComponent(userId)}`,
        { method: "DELETE", credentials: "include" }
      );
      if (!res.ok) throw new Error(await readError(res, "Suppression impossible."));
    },
    onSuccess: () => {
      invalidate();
      toast.success("Accès supprimé.");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return { create, remove };
}
