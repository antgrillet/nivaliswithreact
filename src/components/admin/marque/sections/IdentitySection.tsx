"use client";

import { useFormContext } from "react-hook-form";
import { X } from "lucide-react";
import type { MarqueFormValues } from "@/lib/schemas/marque";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { slugify } from "@/lib/slug";

export default function IdentitySection({ isEdit }: { isEdit: boolean }) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<MarqueFormValues>();

  const nom = watch("nom") ?? "";
  const tags = watch("tags") ?? [];
  const slug = nom ? slugify(nom) : "";

  const addTag = (raw: string) => {
    const value = raw.trim();
    if (!value || tags.includes(value)) return;
    setValue("tags", [...tags, value], { shouldDirty: true });
  };

  const removeTag = (tag: string) => {
    setValue(
      "tags",
      tags.filter((t) => t !== tag),
      { shouldDirty: true }
    );
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="nom">Nom de la marque</Label>
          <Input
            id="nom"
            {...register("nom")}
            readOnly={isEdit}
            aria-invalid={Boolean(errors.nom)}
            placeholder="Ex : The North Face"
          />
          {isEdit ? (
            <p className="text-xs text-muted-foreground">
              Le nom sert d’identifiant et n’est pas modifiable.
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Sert d’identifiant unique. Choisissez-le avec soin.
            </p>
          )}
          {errors.nom && (
            <p className="text-xs text-destructive">{errors.nom.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="displayName">Nom affiché</Label>
          <Input
            id="displayName"
            {...register("displayName")}
            placeholder="Ex : The North Face"
          />
          <p className="text-xs text-muted-foreground">
            Nom soigné montré sur le site (accents, casse). À défaut, l’identifiant
            est utilisé.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Univers</Label>
          <Input id="type" {...register("type")} placeholder="Ex : Vêtements de montagne" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Site web</Label>
          <Input
            id="website"
            {...register("website")}
            placeholder="https://…"
            aria-invalid={Boolean(errors.website)}
          />
          {errors.website && (
            <p className="text-xs text-destructive">{errors.website.message}</p>
          )}
        </div>
      </div>

      {slug && (
        <p className="text-xs text-muted-foreground">
          URL publique : <span className="font-mono">/marques/{slug}</span>
        </p>
      )}

      {/* Tags */}
      <div className="space-y-2">
        <Label>Tags</Label>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="rounded-sm p-0.5 hover:bg-foreground/10"
                  aria-label={`Retirer ${tag}`}
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
        <Input
          placeholder="Ajouter un tag puis Entrée"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag(e.currentTarget.value);
              e.currentTarget.value = "";
            }
          }}
        />
      </div>

      {/* Avancé */}
      <details className="group rounded-md border border-border bg-secondary/30 px-4 py-3">
        <summary className="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-foreground">
          Paramètres avancés
        </summary>
        <div className="mt-4 space-y-2">
          <Label htmlFor="imageFolder">Dossier d’images (legacy)</Label>
          <Input
            id="imageFolder"
            {...register("imageFolder")}
            placeholder={slug ? `/img/${slug}/` : "/img/marque/"}
          />
          <p className="text-xs text-muted-foreground">
            Généré automatiquement à défaut. Conservé pour les images héritées.
          </p>
        </div>
      </details>
    </div>
  );
}
