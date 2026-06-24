"use client";

import { useState } from "react";
import { KeyRound, Plus, Trash2, ShieldCheck, Loader2 } from "lucide-react";
import {
  useAccessUsers,
  useAccessMutations,
  type AccessUser,
} from "@/hooks/admin/useAccess";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

function accessLabel(u: AccessUser): string {
  return (
    u.displayUsername?.trim() ||
    u.username?.trim() ||
    u.name?.trim() ||
    "Accès"
  );
}

export default function AccessManager({
  currentUserId,
}: {
  currentUserId?: string;
}) {
  const { data: users, isLoading } = useAccessUsers();
  const { create, remove } = useAccessMutations();
  const currentId = currentUserId;

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    create.mutate(
      { username, name, password },
      {
        onSuccess: () => {
          setUsername("");
          setName("");
          setPassword("");
        },
      }
    );
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
      {/* Création d'un accès */}
      <section className="space-y-5 rounded-md border border-border bg-card p-6">
        <div>
          <h2 className="flex items-center gap-2 font-serif text-lg tracking-tight">
            <Plus className="size-4" />
            Nouvel accès
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Chaque accès est un compte administrateur avec les mêmes droits.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="acc-username">Identifiant</Label>
            <Input
              id="acc-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ex : marie"
              autoComplete="off"
              minLength={3}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="acc-name">Nom (optionnel)</Label>
            <Input
              id="acc-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex : Marie Dupont"
              autoComplete="off"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="acc-password">Mot de passe</Label>
            <Input
              id="acc-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8 caractères minimum"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>
          <Button type="submit" disabled={create.isPending} className="w-full">
            {create.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Création…
              </>
            ) : (
              <>
                <KeyRound className="size-4" />
                Créer l'accès
              </>
            )}
          </Button>
        </form>
      </section>

      {/* Liste des accès */}
      <section className="space-y-4">
        <h2 className="font-serif text-lg tracking-tight">Accès existants</h2>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : !users || users.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun accès.</p>
        ) : (
          <ul className="divide-y divide-border rounded-md border border-border">
            {users.map((u) => {
              const isSelf = u.id === currentId;
              const confirming = confirmingId === u.id;
              return (
                <li
                  key={u.id}
                  className="flex items-center justify-between gap-4 px-4 py-4"
                >
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 truncate font-medium">
                      <ShieldCheck className="size-4 shrink-0 text-muted-foreground" />
                      {accessLabel(u)}
                      {isSelf ? (
                        <span className="shrink-0 rounded-sm bg-secondary px-1.5 py-0.5 text-[0.65rem] uppercase tracking-wide text-muted-foreground">
                          vous
                        </span>
                      ) : null}
                    </p>
                    {u.name && u.name !== accessLabel(u) ? (
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {u.name}
                      </p>
                    ) : null}
                  </div>

                  {isSelf ? (
                    <span className="shrink-0 text-xs text-muted-foreground">
                      Compte actif
                    </span>
                  ) : confirming ? (
                    <div className="flex shrink-0 items-center gap-2">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        disabled={remove.isPending}
                        onClick={() =>
                          remove.mutate(u.id, {
                            onSettled: () => setConfirmingId(null),
                          })
                        }
                      >
                        Confirmer
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setConfirmingId(null)}
                      >
                        Annuler
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="shrink-0 text-destructive hover:text-destructive"
                      onClick={() => setConfirmingId(u.id)}
                    >
                      <Trash2 className="size-3.5" />
                      Supprimer
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
