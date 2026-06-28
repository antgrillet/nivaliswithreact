"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowUpRight, RotateCcw, Save } from "lucide-react";
import {
  marqueSchema,
  type MarqueInput,
  type MarqueFormValues,
} from "@/lib/schemas/marque";
import type { MarqueData } from "@/lib/types";
import { useMarqueMutations } from "@/hooks/admin/useMarqueMutations";
import { buildPatch } from "@/lib/admin/build-patch";
import { computeCompletion } from "@/lib/admin/marque-completion";
import { useBeforeUnload } from "@/hooks/useBeforeUnload";
import { slugify } from "@/lib/slug";
import { SafeImage } from "@/components/SafeImage";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { UploadActivityProvider } from "@/components/admin/marque/upload-activity";
import SectionNav, { type NavSection } from "@/components/admin/marque/SectionNav";
import CompletionBar from "@/components/admin/marque/CompletionBar";
import SaveStatusBadge, {
  type SaveState,
} from "@/components/admin/marque/SaveStatusBadge";
import IdentitySection from "@/components/admin/marque/sections/IdentitySection";
import DescriptionsSection from "@/components/admin/marque/sections/DescriptionsSection";
import MediaSection from "@/components/admin/marque/sections/MediaSection";
import VideosSection from "@/components/admin/marque/sections/VideosSection";
import ProductsSection from "@/components/admin/marque/sections/ProductsSection";
import ContactSection from "@/components/admin/marque/sections/ContactSection";

interface MarqueEditorProps {
  mode: "create" | "edit";
  initialMarque?: MarqueData;
}

function toDefaults(marque?: MarqueData): MarqueFormValues {
  return {
    nom: marque?.nom ?? "",
    displayName: marque?.displayName ?? "",
    description: marque?.description ?? "",
    description_fr: marque?.description_fr ?? "",
    description_en: marque?.description_en ?? "",
    type: marque?.type ?? "",
    tags: marque?.tags ?? [],
    mainImage: marque?.mainImage ?? "",
    logo: marque?.logo ?? "",
    images: marque?.images ?? [],
    videos: marque?.videos ?? [],
    imageFolder: marque?.imageFolder ?? "",
    website: marque?.website ?? "",
    histoire: marque?.histoire ?? "",
    contact: (marque?.contact ?? {}) as Record<string, unknown>,
    produits: marque?.produits ?? [],
  };
}

/** Sections de l'éditeur — médias en premier. L'ordre définit l'affichage. */
const SECTIONS: { id: string; label: string; hint: string }[] = [
  { id: "medias", label: "Médias", hint: "Logo, image principale et galerie" },
  { id: "identite", label: "Identité", hint: "Nom, univers, site et tags" },
  { id: "descriptions", label: "Descriptions", hint: "Textes et histoire de la marque" },
  { id: "videos", label: "Vidéos", hint: "Fichiers ou liens externes" },
  { id: "produits", label: "Produits", hint: "Sélection de produits phares" },
  { id: "contact", label: "Contact", hint: "Coordonnées affichées sur la page" },
];

/** Champs RHF rattachés à chaque section (point « modifié » du rail). */
const SECTION_FIELDS: Record<string, (keyof MarqueFormValues)[]> = {
  medias: ["logo", "mainImage", "images"],
  identite: ["nom", "displayName", "type", "website", "tags", "imageFolder"],
  descriptions: ["description", "description_fr", "description_en", "histoire"],
  videos: ["videos"],
  produits: ["produits"],
  contact: ["contact"],
};

export default function MarqueEditor({ mode, initialMarque }: MarqueEditorProps) {
  const router = useRouter();
  const isEdit = mode === "edit";
  const { create, update } = useMarqueMutations();

  const defaults = useMemo(() => toDefaults(initialMarque), [initialMarque]);
  const methods = useForm<MarqueFormValues, unknown, MarqueInput>({
    resolver: zodResolver(marqueSchema),
    defaultValues: defaults,
  });

  const {
    control,
    handleSubmit,
    formState: { isDirty, dirtyFields },
  } = methods;

  const formRef = useRef<HTMLFormElement>(null);
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [savedOnce, setSavedOnce] = useState(false);
  const [saveError, setSaveError] = useState(false);

  // Suivi des uploads en cours (galerie, vidéos) pour bloquer la sauvegarde
  // tant que des fichiers montent — sinon leurs URLs manqueraient au PUT.
  const [uploadFlags, setUploadFlags] = useState<Record<string, boolean>>({});
  const reportUploads = useCallback((key: string, uploading: boolean) => {
    setUploadFlags((prev) =>
      (prev[key] ?? false) === uploading ? prev : { ...prev, [key]: uploading }
    );
  }, []);
  const anyUploading = Object.values(uploadFlags).some(Boolean);

  // Abonnement live pour la complétude et l'état des sections. useWatch renvoie
  // déjà les defaultValues au premier rendu (pas de flash 0/8).
  const values = useWatch({ control }) as MarqueFormValues;
  const completion = useMemo(
    () => computeCompletion(values as Partial<MarqueInput>),
    [values]
  );

  const nom = values.nom ?? "";
  const label = (values.displayName?.trim() || nom) ?? "";
  const slug = nom ? slugify(nom) : "";
  const isSaving = isEdit ? update.isPending : create.isPending;
  const saveDisabled = isSaving || anyUploading || (isEdit && !isDirty);

  const saveState: SaveState = isSaving
    ? "saving"
    : saveError
      ? "error"
      : isDirty
        ? "dirty"
        : savedOnce
          ? "saved"
          : "idle";

  // Garde anti-perte : fermeture / rafraîchissement de l'onglet.
  useBeforeUnload(isDirty);

  // ⌘S / Ctrl+S déclenche la sauvegarde explicite.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (!saveDisabled) formRef.current?.requestSubmit();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [saveDisabled]);

  // Scroll-spy : surligne la section visible dans le rail.
  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (els.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const navSections: NavSection[] = SECTIONS.map((s) => ({
    id: s.id,
    label: s.label,
    status: completion.bySection[s.id] ?? "empty",
    dirty: SECTION_FIELDS[s.id].some((f) => Boolean(dirtyFields[f])),
  }));

  const onSubmit = handleSubmit((data) => {
    if (anyUploading) {
      toast.error("Téléversement en cours, patientez avant d’enregistrer.");
      return;
    }
    setSaveError(false);
    if (isEdit) {
      const patch = buildPatch(
        data,
        dirtyFields as Partial<Record<keyof MarqueInput, unknown>>
      );
      update.mutate(patch, {
        onSuccess: (marque) => {
          methods.reset(toDefaults(marque));
          setSavedOnce(true);
        },
        onError: () => setSaveError(true),
      });
    } else {
      const imageFolder =
        data.imageFolder?.trim() || `/img/${slugify(data.nom)}/`;
      create.mutate(
        { ...data, imageFolder },
        {
          onSuccess: (marque) => {
            setSavedOnce(true);
            methods.reset(toDefaults(marque));
            router.replace(`/admin/marques/${encodeURIComponent(marque.nom)}`);
          },
          onError: () => setSaveError(true),
        }
      );
    }
  });

  const handleBack = () => {
    if (isDirty) setConfirmLeave(true);
    else router.push("/admin/marques");
  };

  return (
    <UploadActivityProvider report={reportUploads}>
      <FormProvider {...methods}>
      <form ref={formRef} onSubmit={onSubmit}>
        {/* En-tête sticky */}
        <header className="sticky top-0 z-20 -mx-5 border-b border-border bg-background/95 px-5 py-4 backdrop-blur md:-mx-10 md:px-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleBack}
                className="link-underline inline-flex items-center gap-1.5 self-start pb-0.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="size-4" />
                Marques
              </button>
              <div className="hidden h-8 w-px bg-border sm:block" />
              <div className="flex items-center gap-3">
                <div className="relative size-10 shrink-0 overflow-hidden rounded border border-border bg-secondary/40">
                  <SafeImage
                    src={values.logo || values.mainImage}
                    alt={label || "Marque"}
                    fill
                    sizes="40px"
                    className="object-contain"
                    fallbackLabel={(label || "N").charAt(0)}
                  />
                </div>
                <div className="min-w-0">
                  <h1 className="truncate font-serif text-xl tracking-tight">
                    {label || (isEdit ? "Marque" : "Nouvelle marque")}
                  </h1>
                  {isEdit && slug ? (
                    <Link
                      href={`/marques/${slug}`}
                      target="_blank"
                      className="link-underline inline-flex items-center gap-1 pb-0.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      /marques/{slug}
                      <ArrowUpRight className="size-3" />
                    </Link>
                  ) : (
                    <p className="font-mono text-xs text-muted-foreground">
                      {slug ? `/marques/${slug}` : "Renseignez le nom"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 lg:gap-4">
              <CompletionBar completion={completion} />
              <div className="hidden sm:block">
                <SaveStatusBadge state={saveState} />
              </div>
              <div className="ml-auto flex items-center gap-2 lg:ml-0">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => methods.reset()}
                  disabled={!isDirty || isSaving}
                >
                  <RotateCcw className="size-3.5" />
                  <span className="hidden sm:inline">Réinitialiser</span>
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={saveDisabled}
                  title={anyUploading ? "Téléversement en cours…" : undefined}
                >
                  <Save className="size-3.5" />
                  {isSaving
                    ? "Enregistrement…"
                    : isEdit
                      ? "Enregistrer"
                      : "Créer la marque"}
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-3 sm:hidden">
            <SaveStatusBadge state={saveState} />
          </div>
        </header>

        {/* Corps : rail + canevas */}
        <div className="grid gap-8 pt-8 lg:grid-cols-[200px_minmax(0,1fr)]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionNav sections={navSections} activeId={activeId} />
          </div>

          <div className="min-w-0 space-y-6">
            {SECTIONS.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-28 rounded-md border border-border bg-card p-6"
              >
                <header className="mb-5">
                  <h2 className="eyebrow">{section.label}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{section.hint}</p>
                </header>
                {section.id === "medias" && <MediaSection />}
                {section.id === "identite" && <IdentitySection isEdit={isEdit} />}
                {section.id === "descriptions" && <DescriptionsSection />}
                {section.id === "videos" && <VideosSection />}
                {section.id === "produits" && <ProductsSection />}
                {section.id === "contact" && <ContactSection />}
              </section>
            ))}
          </div>
        </div>
      </form>

      {/* Garde anti-perte : quitter l'éditeur */}
      <Dialog open={confirmLeave} onOpenChange={setConfirmLeave}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif tracking-tight">
              Quitter sans enregistrer ?
            </DialogTitle>
            <DialogDescription>
              Vos modifications non enregistrées seront perdues.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setConfirmLeave(false)}
            >
              Continuer l’édition
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                setConfirmLeave(false);
                router.push("/admin/marques");
              }}
            >
              Abandonner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </FormProvider>
    </UploadActivityProvider>
  );
}
