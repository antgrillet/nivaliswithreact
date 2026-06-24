"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, X } from "lucide-react";
import {
  marqueSchema,
  type MarqueInput,
  type MarqueFormValues,
} from "@/lib/schemas/marque";
import type { MarqueData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import ImageField from "@/components/admin/ImageField";
import { slugify } from "@/lib/slug";

interface MarqueFormProps {
  /** Marque existante (édition) ou undefined (création). */
  marque?: MarqueData;
  onSubmit: (values: MarqueInput) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
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

export default function MarqueForm({
  marque,
  onSubmit,
  onCancel,
  isSubmitting,
}: MarqueFormProps) {
  const isEdit = Boolean(marque);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MarqueFormValues, unknown, MarqueInput>({
    resolver: zodResolver(marqueSchema),
    defaultValues: toDefaults(marque),
  });

  const {
    fields: produitFields,
    append: appendProduit,
    remove: removeProduit,
  } = useFieldArray({ control, name: "produits" });

  const nom = watch("nom");
  const tags = watch("tags") ?? [];
  const images = watch("images") ?? [];
  const logo = watch("logo");
  const mainImage = watch("mainImage");
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

  const submit = handleSubmit((values) => {
    // Pour la création, génère un dossier par défaut si absent.
    const imageFolder =
      values.imageFolder?.trim() || `/img/${slugify(values.nom)}/`;
    onSubmit({ ...values, imageFolder });
  });

  return (
    <form onSubmit={submit} className="space-y-8">
      {/* Identité */}
      <section className="space-y-4">
        <h3 className="eyebrow">Identité</h3>
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
            {isEdit && (
              <p className="text-xs text-muted-foreground">
                Le nom sert d’identifiant et n’est pas modifiable.
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
              Nom soigné montré sur le site (accents, casse). À défaut, l’identifiant est utilisé.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Univers</Label>
            <Input
              id="type"
              {...register("type")}
              placeholder="Ex : Vêtements de montagne"
            />
          </div>
        </div>
        {slug && (
          <p className="text-xs text-muted-foreground">
            URL publique : <span className="font-mono">/marques/{slug}</span>
          </p>
        )}

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

        {/* Tags */}
        <div className="space-y-2">
          <Label>Tags</Label>
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
      </section>

      <Separator />

      {/* Descriptions */}
      <section className="space-y-4">
        <h3 className="eyebrow">Descriptions</h3>
        <div className="space-y-2">
          <Label htmlFor="description">Description courte</Label>
          <Textarea id="description" rows={2} {...register("description")} />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="description_fr">Description (FR)</Label>
            <Textarea
              id="description_fr"
              rows={5}
              {...register("description_fr")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description_en">Description (EN)</Label>
            <Textarea
              id="description_en"
              rows={5}
              {...register("description_en")}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="histoire">Histoire</Label>
          <Textarea id="histoire" rows={4} {...register("histoire")} />
        </div>
      </section>

      <Separator />

      {/* Contact */}
      <section className="space-y-4">
        <h3 className="eyebrow">Contact</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="contact-email">Email</Label>
            <Input id="contact-email" {...register("contact.email")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-phone">Téléphone</Label>
            <Input id="contact-phone" {...register("contact.telephone")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-address">Adresse</Label>
            <Input id="contact-address" {...register("contact.adresse")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-hours">Horaires</Label>
            <Input id="contact-hours" {...register("contact.horaires")} />
          </div>
        </div>
      </section>

      <Separator />

      {/* Images */}
      <section className="space-y-4">
        <h3 className="eyebrow">Images</h3>
        <div className="grid gap-6 sm:grid-cols-2">
          <ImageField
            label="Logo"
            value={logo}
            onChange={(url) => setValue("logo", url, { shouldDirty: true })}
            onClear={() => setValue("logo", "", { shouldDirty: true })}
            uploadPrefix={`marques/${slug || "marque"}/logo`}
            payload={{ marque: nom, type: "logo" }}
            aspect="video"
          />
          <ImageField
            label="Image principale"
            value={mainImage}
            onChange={(url) => setValue("mainImage", url, { shouldDirty: true })}
            onClear={() => setValue("mainImage", "", { shouldDirty: true })}
            uploadPrefix={`marques/${slug || "marque"}/main`}
            payload={{ marque: nom, type: "mainImage" }}
            aspect="video"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Galerie</Label>
            <span className="text-xs text-muted-foreground">
              {images.length} image(s)
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {images.map((img, index) => (
              <div
                key={`${img}-${index}`}
                className="space-y-2 rounded-md border border-border p-2"
              >
                <ImageField
                  value={img}
                  onChange={(url) =>
                    setValue(
                      "images",
                      images.map((v, i) => (i === index ? url : v)),
                      { shouldDirty: true }
                    )
                  }
                  onClear={() =>
                    setValue(
                      "images",
                      images.filter((_, i) => i !== index),
                      { shouldDirty: true }
                    )
                  }
                  uploadPrefix={`marques/${slug || "marque"}/gallery`}
                  payload={{ marque: nom, type: "gallery" }}
                  aspect="square"
                />
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setValue("images", [...images, ""], { shouldDirty: true })
            }
          >
            <Plus className="size-3.5" />
            Ajouter une image
          </Button>
        </div>
      </section>

      <Separator />

      {/* Produits */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="eyebrow">Produits phares</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              appendProduit({ nom: "", description: "", image: "", prix: "" })
            }
          >
            <Plus className="size-3.5" />
            Ajouter
          </Button>
        </div>

        {produitFields.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun produit.</p>
        ) : (
          <div className="space-y-4">
            {produitFields.map((field, index) => (
              <div
                key={field.id}
                className="space-y-3 rounded-md border border-border p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="eyebrow">Produit {index + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => removeProduit(index)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Nom</Label>
                    <Input {...register(`produits.${index}.nom` as const)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Prix</Label>
                    <Input {...register(`produits.${index}.prix` as const)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    rows={2}
                    {...register(`produits.${index}.description` as const)}
                  />
                </div>
                <Controller
                  control={control}
                  name={`produits.${index}.image` as const}
                  render={({ field: imgField }) => (
                    <ImageField
                      label="Image produit"
                      value={imgField.value}
                      onChange={imgField.onChange}
                      onClear={() => imgField.onChange("")}
                      uploadPrefix={`marques/${slug || "marque"}/produits`}
                      payload={{ marque: nom, type: "produit" }}
                      aspect="square"
                    />
                  )}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      <Separator />

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Enregistrement…"
            : isEdit
              ? "Enregistrer"
              : "Créer la marque"}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Annuler
          </Button>
        )}
      </div>
    </form>
  );
}
