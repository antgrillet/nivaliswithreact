import type { Metadata } from "next";
import { headers } from "next/headers";
import AccessManager from "@/components/admin/AccessManager";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Accès",
  robots: { index: false, follow: false },
};

export default async function AdminAccessPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow">Sécurité</p>
        <h1 className="mt-2 font-serif text-3xl tracking-tight">Accès</h1>
        <p className="mt-2 max-w-prose text-sm text-muted-foreground">
          Gérez les comptes administrateurs du site : créez un identifiant et un
          mot de passe pour chaque personne, ou révoquez un accès.
        </p>
      </header>

      <AccessManager currentUserId={session?.user?.id} />
    </div>
  );
}
