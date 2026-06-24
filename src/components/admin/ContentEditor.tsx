"use client";

import { useMemo, useState } from "react";
import { Save, RotateCcw, AlertTriangle } from "lucide-react";
import type { ContentValue, SiteContent } from "@/lib/types";
import { useContent } from "@/hooks/admin/useContent";
import { useContentMutations } from "@/hooks/admin/useContentMutations";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ContentField, { humanize } from "@/components/admin/ContentFields";

/**
 * Squelettes des sous-sections connues : garantissent des champs éditables
 * même si la base est vide. L'ordre définit l'ordre d'affichage des onglets.
 * Étendre ce schéma = rendre une nouvelle zone du site éditable.
 */
const SCHEMA: Record<string, Record<string, ContentValue>> = {
  site: {
    contact: {
      address: "",
      phone: "",
      email: "",
      hours: "",
      mapsEmbedUrl: "",
      mapsLink: "",
    },
    social: {
      instagram: "",
      facebook: "",
      linkedin: "",
      tiktok: "",
      youtube: "",
    },
    branding: { name: "", baseline: "" },
    seo: { defaultTitle: "", titleTemplate: "", description: "", ogImage: "" },
  },
  homepage: {
    hero: { eyebrow: "", title: "", subtitle: "", description: "" },
    introduction: {
      title: "",
      paragraph1: "",
      paragraph2: "",
      hours: "",
      address: "",
    },
    brands: { title: "", subtitle: "" },
    arpin: { title: "", subtitle: "" },
    team: {
      title: "",
      description: "",
      members: [{ name: "", role: "", description: "", image: "" }],
    },
    store: {
      title: "",
      subtitle: "",
      description: "",
      testimonials: [{ name: "", role: "", text: "" }],
    },
  },
  arpin: {
    hero: { title: "", subtitle: "", description: "", image: "" },
    heritage: { title: "", content: "", quote: "" },
    process: { steps: [{ n: "", title: "", body: "" }] },
    facts: { items: [{ value: "", label: "" }] },
    gallery: { images: [{ src: "", alt: "" }] },
    catalog: { description: "", file: "" },
  },
  legal: {
    mentions: { title: "", content: "" },
    cgv: { title: "", content: "" },
    confidentialite: { title: "", content: "" },
  },
};

const SECTION_LABELS: Record<string, string> = {
  site: "Réglages du site",
  homepage: "Page d’accueil",
  arpin: "Page Arpin",
  legal: "Pages légales",
};

const SUBSECTION_LABELS: Record<string, string> = {
  contact: "Coordonnées",
  social: "Réseaux sociaux",
  branding: "Identité",
  seo: "Référencement (SEO)",
  hero: "Bannière (hero)",
  introduction: "Introduction",
  brands: "Marques",
  arpin: "Bloc Arpin",
  team: "Équipe",
  store: "Boutique & avis",
  heritage: "Héritage",
  process: "Savoir-faire",
  facts: "Repères chiffrés",
  gallery: "Galerie",
  catalog: "Catalogue",
  mentions: "Mentions légales",
  cgv: "CGV",
  confidentialite: "Confidentialité",
};

const subLabel = (key: string) => SUBSECTION_LABELS[key] ?? humanize(key);

const SECTIONS = Object.keys(SCHEMA);

/** Fusionne le contenu en base avec le squelette connu (sans écraser les données). */
function mergeWithSchema(
  section: string,
  remote: SiteContent | undefined
): Record<string, ContentValue> {
  const base = SCHEMA[section] ?? {};
  const live = remote?.[section] ?? {};
  const result: Record<string, ContentValue> = {};
  const keys = new Set([...Object.keys(base), ...Object.keys(live)]);
  for (const key of keys) {
    result[key] = (live[key] ?? base[key] ?? {}) as ContentValue;
  }
  return result;
}

export default function ContentEditor() {
  const { data, isLoading } = useContent();
  const { save } = useContentMutations();

  const [section, setSection] = useState<string>("site");
  const [requestedSubsection, setRequestedSubsection] =
    useState<string>("contact");
  // Cible de navigation en attente quand le brouillon n'est pas enregistré.
  const [pending, setPending] = useState<
    { kind: "section" | "subsection"; value: string } | null
  >(null);

  const subsections = useMemo(
    () => mergeWithSchema(section, data),
    [section, data]
  );
  const subsectionKeys = Object.keys(subsections);

  // Sous-section active (clampée si la sélection n'existe pas dans la section).
  const subsection = subsectionKeys.includes(requestedSubsection)
    ? requestedSubsection
    : (subsectionKeys[0] ?? "");

  const current = subsections[subsection] ?? {};

  // Brouillon local : réinitialisé pendant le rendu quand la source ou la
  // sélection change (motif React « ajuster l'état pendant le rendu »).
  const [draft, setDraft] = useState<ContentValue>(() =>
    structuredClone(current)
  );
  const signature = `${section}::${subsection}::${JSON.stringify(current)}`;
  const [lastSignature, setLastSignature] = useState(signature);
  if (signature !== lastSignature) {
    setLastSignature(signature);
    setDraft(structuredClone(current));
    setPending(null);
  }

  const isDirty = JSON.stringify(draft) !== JSON.stringify(current);

  const handleSave = () => {
    save.mutate({ section, subsection, content: draft as ContentValue });
  };

  // Navigation gardée : si des modifications ne sont pas enregistrées, on
  // diffère le changement et on demande confirmation (sans dialog bloquant).
  const requestSwitch = (kind: "section" | "subsection", value: string) => {
    if (kind === "section" && value === section) return;
    if (kind === "subsection" && value === subsection) return;
    if (isDirty) {
      setPending({ kind, value });
      return;
    }
    applySwitch(kind, value);
  };

  const applySwitch = (kind: "section" | "subsection", value: string) => {
    if (kind === "section") {
      setSection(value);
      const firstKey = Object.keys(SCHEMA[value] ?? {})[0] ?? "";
      setRequestedSubsection(firstKey);
    } else {
      setRequestedSubsection(value);
    }
    setPending(null);
  };

  const entries = Object.entries(draft as Record<string, unknown>);

  return (
    <div className="space-y-6">
      {/* Choix de la section */}
      <Tabs
        value={section}
        onValueChange={(v) => requestSwitch("section", v)}
      >
        <TabsList className="flex-wrap">
          {SECTIONS.map((s) => (
            <TabsTrigger key={s} value={s}>
              {SECTION_LABELS[s] ?? humanize(s)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        {/* Sous-sections */}
        <nav className="flex flex-row flex-wrap gap-1 lg:flex-col">
          {subsectionKeys.map((key) => {
            const active = subsection === key;
            const dirtyHere = active && isDirty;
            return (
              <button
                key={key}
                type="button"
                onClick={() => requestSwitch("subsection", key)}
                className={`flex items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                  active
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <span>{subLabel(key)}</span>
                {dirtyHere ? (
                  <span
                    className="size-1.5 shrink-0 rounded-full bg-background"
                    aria-hidden="true"
                  />
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* Éditeur */}
        <div className="space-y-6 rounded-md border border-border bg-card p-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-lg tracking-tight">
                    {subLabel(subsection)}
                  </h3>
                  <p className="eyebrow mt-0.5">
                    {SECTION_LABELS[section] ?? section}
                    {isDirty ? (
                      <span className="ml-2 normal-case tracking-normal text-destructive">
                        • Modifications non enregistrées
                      </span>
                    ) : null}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setDraft(structuredClone(current))}
                    disabled={save.isPending || !isDirty}
                  >
                    <RotateCcw className="size-3.5" />
                    Réinitialiser
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleSave}
                    disabled={save.isPending || !isDirty}
                  >
                    <Save className="size-3.5" />
                    {save.isPending ? "Enregistrement…" : "Enregistrer"}
                  </Button>
                </div>
              </div>

              {/* Garde-fou de navigation : brouillon non enregistré */}
              {pending ? (
                <div className="flex flex-col gap-3 rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
                  <p className="flex items-center gap-2 text-foreground">
                    <AlertTriangle className="size-4 shrink-0 text-destructive" />
                    Vous avez des modifications non enregistrées.
                  </p>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setPending(null)}
                    >
                      Continuer l’édition
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => applySwitch(pending.kind, pending.value)}
                    >
                      Abandonner
                    </Button>
                  </div>
                </div>
              ) : null}

              <div className="space-y-5">
                {entries.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Cette sous-section ne contient aucun champ.
                  </p>
                ) : (
                  entries.map(([key, value]) => (
                    <ContentField
                      key={key}
                      path={[key]}
                      value={value}
                      uploadPrefix={`content/${section}/${subsection}`}
                      onChange={(next) =>
                        setDraft((prev) => ({
                          ...(prev as Record<string, unknown>),
                          [key]: next,
                        }))
                      }
                    />
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
