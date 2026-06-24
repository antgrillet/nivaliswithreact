import Link from "next/link";
import {
  ArrowUpRight,
  Tag,
  FileText,
  Images,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { getMarques } from "@/lib/data/marques";
import { getAllContent } from "@/lib/data/content";
import type { MarqueData } from "@/lib/types";
import DashboardStats from "@/components/admin/DashboardStats";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";

const QUICK_LINKS = [
  {
    href: "/admin/marques",
    label: "Marques",
    description: "Créer, éditer et organiser les marques.",
    icon: Tag,
  },
  {
    href: "/admin/contenu",
    label: "Contenu éditorial",
    description: "Textes de la page d’accueil et de la page Arpin.",
    icon: FileText,
  },
  {
    href: "/admin/mediatheque",
    label: "Médiathèque",
    description: "Téléverser et gérer les images.",
    icon: Images,
  },
] as const;

/** Nom d'affichage soigné si présent, sinon l'identifiant. */
function marqueLabel(marque: MarqueData): string {
  return marque.displayName?.trim() || marque.nom;
}

/** Éléments clés manquants d'une marque (logo, image principale, description). */
function missingFields(marque: MarqueData): string[] {
  const missing: string[] = [];
  if (!marque.logo?.trim()) missing.push("Logo");
  if (!marque.mainImage?.trim()) missing.push("Image principale");
  const hasDescription =
    Boolean(marque.description?.trim()) ||
    Boolean(marque.description_fr?.trim()) ||
    Boolean(marque.description_en?.trim());
  if (!hasDescription) missing.push("Description");
  return missing;
}

export default async function AdminDashboardPage() {
  const [marques, content] = await Promise.all([
    getMarques(),
    getAllContent(),
  ]);

  const withLogo = marques.filter((m) => Boolean(m.logo?.trim())).length;
  const galleryImages = marques.reduce(
    (sum, m) => sum + (m.images?.length ?? 0),
    0
  );
  const sectionsCount = Object.values(content).reduce(
    (sum, section) => sum + Object.keys(section).length,
    0
  );

  const incomplete = marques
    .map((m) => ({ marque: m, missing: missingFields(m) }))
    .filter((entry) => entry.missing.length > 0);

  return (
    <div className="space-y-10">
      <header>
        <p className="eyebrow">Back-office Nivalis</p>
        <h1 className="mt-2 font-serif text-3xl tracking-tight">
          Tableau de bord
        </h1>
        <p className="mt-2 max-w-prose text-sm text-muted-foreground">
          Vue d’ensemble des contenus du site. Gérez les marques, le contenu
          éditorial et la médiathèque depuis cet espace.
        </p>
      </header>

      <DashboardStats
        stats={[
          { label: "Marques", value: marques.length, href: "/admin/marques" },
          {
            label: "Logos",
            value: withLogo,
            hint:
              marques.length - withLogo > 0
                ? `${marques.length - withLogo} sans logo`
                : "Tous renseignés",
            href: "/admin/marques",
          },
          {
            label: "Images de galerie",
            value: galleryImages,
            href: "/admin/mediatheque",
          },
          {
            label: "Blocs éditoriaux",
            value: sectionsCount,
            href: "/admin/contenu",
          },
        ]}
      />

      <section className="space-y-4">
        <h2 className="font-serif text-xl tracking-tight">Accès rapides</h2>
        <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-3">
          {QUICK_LINKS.map(({ href, label, description, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col gap-3 bg-card p-6 transition-colors hover:bg-secondary/50"
            >
              <div className="flex items-center justify-between">
                <Icon className="size-5 text-muted-foreground" />
                <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
              <div>
                <h3 className="font-medium">{label}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {marques.length > 0 && (
        <section className="space-y-4">
          <Separator />
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-serif text-xl tracking-tight">À compléter</h2>
            {incomplete.length > 0 && (
              <span className="text-sm text-muted-foreground tabular-nums">
                {incomplete.length} marque{incomplete.length > 1 ? "s" : ""} à
                finaliser
              </span>
            )}
          </div>

          {incomplete.length === 0 ? (
            <div className="flex items-center gap-3 rounded-md border border-border bg-card px-5 py-6 text-sm">
              <CheckCircle2 className="size-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Tout est complet</p>
                <p className="mt-0.5 text-muted-foreground">
                  Chaque marque dispose d’un logo, d’une image principale et
                  d’une description.
                </p>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-border rounded-md border border-border bg-card">
              {incomplete.map(({ marque, missing }) => (
                <li
                  key={marque.nom}
                  className="flex flex-col gap-2 px-5 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-2 font-medium">
                    <AlertTriangle className="size-4 shrink-0 text-destructive" />
                    {marqueLabel(marque)}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                    <span className="text-destructive">
                      Manque : {missing.join(", ")}
                    </span>
                    <Link
                      href="/admin/marques"
                      className="link-underline shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Compléter
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {marques.length > 0 && (
        <section className="space-y-4">
          <Separator />
          <h2 className="font-serif text-xl tracking-tight">Marques récentes</h2>
          <ul className="divide-y divide-border rounded-md border border-border bg-card">
            {marques.slice(0, 6).map((marque) => (
              <li
                key={marque.nom}
                className="flex items-center justify-between px-5 py-3 text-sm"
              >
                <span className="font-medium">{marqueLabel(marque)}</span>
                <span className="text-muted-foreground">
                  {marque.type || "—"}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
