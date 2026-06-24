"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isSetup = searchParams.get("setup") === "1";
  const nextPath = searchParams.get("next") || "/admin";

  useEffect(() => {
    authClient.getSession().then(({ data }) => {
      if (data?.user) router.replace(nextPath);
    });
  }, [router, nextPath]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const normalized = username.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");
    const fallbackEmail = `${normalized || "user"}@local.invalid`;

    const action = isSetup
      ? authClient.signUp.email({
          email: fallbackEmail,
          username,
          password,
          name: name || username,
        })
      : authClient.signIn.username({ username, password });

    const { error: authError } = await action;
    setIsLoading(false);

    if (authError) {
      setError(isSetup ? "Impossible de créer le compte." : "Identifiants invalides.");
      return;
    }
    window.location.assign(nextPath);
  };

  return (
    <div className="w-full max-w-md border border-border bg-card p-8 md:p-10">
      <p className="eyebrow">Espace privé</p>
      <h1 className="mt-3 font-serif text-3xl tracking-tight">
        {isSetup ? "Créer l'accès admin" : "Connexion"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {isSetup
          ? "Configurez l'identifiant administrateur."
          : "Connectez-vous pour gérer les contenus du site."}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="username">Identifiant</Label>
          <Input
            id="username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        {isSetup && (
          <div className="space-y-2">
            <Label htmlFor="name">Nom</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            autoComplete={isSetup ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && (
          <p className="border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading
            ? isSetup
              ? "Création…"
              : "Connexion…"
            : isSetup
              ? "Créer le compte"
              : "Se connecter"}
        </Button>
      </form>
    </div>
  );
}
