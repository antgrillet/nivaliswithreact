"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageField from "@/components/admin/ImageField";

type Json = unknown;

const isImageKey = (key: string) =>
  /image|logo|photo|cover|visuel|illustration|\bsrc\b|ogimage|vignette/i.test(key);

/** Libellés français soignés pour les clés de champ courantes. */
const FIELD_LABELS: Record<string, string> = {
  title: "Titre",
  subtitle: "Sous-titre",
  description: "Description",
  content: "Contenu",
  text: "Texte",
  quote: "Citation",
  body: "Texte",
  eyebrow: "Sur-titre",
  baseline: "Accroche",
  name: "Nom",
  role: "Rôle",
  email: "E-mail",
  phone: "Téléphone",
  address: "Adresse",
  hours: "Horaires",
  image: "Image",
  images: "Images",
  src: "Image",
  alt: "Texte alternatif",
  value: "Valeur",
  label: "Libellé",
  members: "Membres",
  testimonials: "Témoignages",
  steps: "Étapes",
  items: "Éléments",
  gallery: "Galerie",
  n: "Numéro",
  file: "Fichier (PDF)",
  paragraph1: "Paragraphe 1",
  paragraph2: "Paragraphe 2",
  mapsEmbedUrl: "Carte (intégration Google Maps)",
  mapsLink: "Lien Google Maps",
  defaultTitle: "Titre par défaut",
  titleTemplate: "Modèle de titre",
  ogImage: "Image de partage (réseaux)",
};

const humanize = (key: string) =>
  FIELD_LABELS[key] ??
  key.replace(/_/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2");

interface FieldProps {
  /** Chemin de la clé dans l'objet racine, ex : ["members", "0", "image"]. */
  path: string[];
  value: Json;
  onChange: (value: Json) => void;
  uploadPrefix: string;
  label?: string;
}

/** Rend récursivement une valeur de contenu : chaîne, image, objet ou liste. */
export default function ContentField({
  path,
  value,
  onChange,
  uploadPrefix,
  label,
}: FieldProps) {
  const key = path[path.length - 1] ?? "";
  const displayLabel = label ?? humanize(key);

  // Champ image
  if (isImageKey(key) && (typeof value === "string" || value == null)) {
    return (
      <ImageField
        label={displayLabel}
        value={typeof value === "string" ? value : ""}
        onChange={(url) => onChange(url)}
        onClear={() => onChange("")}
        uploadPrefix={uploadPrefix}
        payload={{ section: uploadPrefix, key: path.join(".") }}
        aspect="square"
      />
    );
  }

  // Liste (tableau)
  if (Array.isArray(value)) {
    const items = value as Json[];
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>{displayLabel}</Label>
          <span className="text-xs text-muted-foreground">
            {items.length} élément(s)
          </span>
        </div>
        <div className="space-y-3">
          {items.map((item, index) => {
            const isObject =
              typeof item === "object" && item !== null && !Array.isArray(item);
            return (
              <div
                key={index}
                className="space-y-3 rounded-md border border-border p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="eyebrow">
                    {humanize(key)} {index + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() =>
                      onChange(items.filter((_, i) => i !== index))
                    }
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
                {isObject ? (
                  <div className="space-y-3">
                    {Object.entries(item as Record<string, Json>).map(
                      ([childKey, childValue]) => (
                        <ContentField
                          key={childKey}
                          path={[...path, String(index), childKey]}
                          value={childValue}
                          uploadPrefix={uploadPrefix}
                          onChange={(next) =>
                            onChange(
                              items.map((it, i) =>
                                i === index
                                  ? {
                                      ...(it as Record<string, Json>),
                                      [childKey]: next,
                                    }
                                  : it
                              )
                            )
                          }
                        />
                      )
                    )}
                  </div>
                ) : (
                  <Input
                    value={typeof item === "string" ? item : String(item ?? "")}
                    onChange={(e) =>
                      onChange(
                        items.map((it, i) => (i === index ? e.target.value : it))
                      )
                    }
                  />
                )}
              </div>
            );
          })}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            const template =
              items.length > 0 &&
              typeof items[0] === "object" &&
              items[0] !== null
                ? Object.fromEntries(
                    Object.keys(items[0] as Record<string, Json>).map((k) => [
                      k,
                      "",
                    ])
                  )
                : "";
            onChange([...items, template]);
          }}
        >
          <Plus className="size-3.5" />
          Ajouter
        </Button>
      </div>
    );
  }

  // Objet imbriqué
  if (typeof value === "object" && value !== null) {
    const obj = value as Record<string, Json>;
    return (
      <div className="space-y-3">
        <Label>{displayLabel}</Label>
        <div className="space-y-3 rounded-md border border-border bg-secondary/30 p-4">
          {Object.entries(obj).map(([childKey, childValue]) => (
            <ContentField
              key={childKey}
              path={[...path, childKey]}
              value={childValue}
              uploadPrefix={uploadPrefix}
              onChange={(next) => onChange({ ...obj, [childKey]: next })}
            />
          ))}
        </div>
      </div>
    );
  }

  // Texte (long ou court)
  const stringValue = typeof value === "string" ? value : String(value ?? "");
  const isLong =
    stringValue.length > 80 ||
    /paragraph|description|histoire|body|texte|content|text|quote|baseline/i.test(key);

  return (
    <div className="space-y-2">
      <Label htmlFor={path.join("-")}>{displayLabel}</Label>
      {isLong ? (
        <Textarea
          id={path.join("-")}
          rows={4}
          value={stringValue}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <Input
          id={path.join("-")}
          value={stringValue}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

export { isImageKey, humanize };
