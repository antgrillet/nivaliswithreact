"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { authClient } from "@/lib/auth-client";

function LoginPageContent() {
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
    const checkSession = async () => {
      const { data } = await authClient.getSession();
      if (data?.user) {
        router.replace(nextPath);
      }
    };
    checkSession();
  }, [router, nextPath]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const normalizedEmailLocal = username
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, "");
    const fallbackEmail = `${normalizedEmailLocal || "user"}@local.invalid`;

    const action = isSetup
      ? authClient.signUp.email({
          email: fallbackEmail,
          username,
          password,
          name: name || username,
        })
      : authClient.signIn.username({
          username,
          password,
        });

    const { error: signInError } = await action;

    setIsLoading(false);

    if (signInError) {
      setError(
        isSetup
          ? "Impossible de créer le compte"
          : "Identifiants invalides"
      );
      return;
    }

    window.location.assign(nextPath);
  };

  return (
    <main className="min-h-screen bg-amber-50/50">
      <Navbar />
      <section className="container mx-auto px-4 py-24">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-amber-100 p-8">
          <h1 className="text-2xl font-bold text-amber-900 mb-2">
            {isSetup ? "Créer l'accès admin" : "Accès administration"}
          </h1>
          <p className="text-amber-700 mb-6">
            {isSetup
              ? "Configurez l'identifiant administrateur."
              : "Connectez-vous pour gérer les contenus du site."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-amber-900 mb-2"
              >
                Identifiant
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full rounded-lg border border-amber-200 bg-amber-50/50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                required
              />
            </div>
            {isSetup && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-amber-900 mb-2"
                >
                  Nom
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full rounded-lg border border-amber-200 bg-amber-50/50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                />
              </div>
            )}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-amber-900 mb-2"
              >
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-amber-200 bg-amber-50/50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                required
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="w-full rounded-lg bg-amber-700 text-white py-2.5 font-semibold hover:bg-amber-800 transition-colors disabled:opacity-60"
              disabled={isLoading}
            >
              {isLoading
                ? isSetup
                  ? "Création..."
                  : "Connexion..."
                : isSetup
                  ? "Créer le compte"
                  : "Se connecter"}
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </main>
  );
}

const LoginFallback = () => (
  <main className="min-h-screen bg-amber-50/50 flex items-center justify-center">
    <p className="text-amber-800 text-base">Chargement...</p>
  </main>
);

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginPageContent />
    </Suspense>
  );
}
