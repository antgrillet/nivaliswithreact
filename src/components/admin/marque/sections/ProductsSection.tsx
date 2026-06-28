"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { Plus, Trash2, GripVertical } from "lucide-react";
import type { MarqueFormValues } from "@/lib/schemas/marque";
import { slugify } from "@/lib/slug";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SingleAssetSlot from "@/components/admin/marque/SingleAssetSlot";

function ProductCard({
  id,
  index,
  onRemove,
}: {
  id: string;
  index: number;
  onRemove: () => void;
}) {
  const { register, watch, setValue } = useFormContext<MarqueFormValues>();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const nom = watch("nom") ?? "";
  const slug = slugify(nom) || "marque";
  const image = watch(`produits.${index}.image` as const) ?? "";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`space-y-3 rounded-md border bg-card p-4 ${
        isDragging ? "z-10 border-foreground shadow-lg" : "border-border"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="flex size-6 cursor-grab touch-none items-center justify-center rounded text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground active:cursor-grabbing"
            aria-label="Déplacer le produit"
          >
            <GripVertical className="size-4" />
          </button>
          <span className="eyebrow">Produit {index + 1}</span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={onRemove}
        >
          <Trash2 className="size-3.5" />
          Retirer
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Nom</Label>
          <Input {...register(`produits.${index}.nom` as const)} />
        </div>
        <div className="space-y-2">
          <Label>Prix</Label>
          <Input
            {...register(`produits.${index}.prix` as const)}
            placeholder="Ex : 249 €"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea rows={2} {...register(`produits.${index}.description` as const)} />
      </div>

      <SingleAssetSlot
        label="Image produit"
        role="produit"
        aspect="square"
        value={image}
        slug={slug}
        nom={nom}
        onChange={(url) =>
          setValue(`produits.${index}.image` as const, url, { shouldDirty: true })
        }
        onClear={() =>
          setValue(`produits.${index}.image` as const, "", { shouldDirty: true })
        }
      />
    </div>
  );
}

export default function ProductsSection() {
  const { control } = useFormContext<MarqueFormValues>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "produits",
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = fields.findIndex((f) => f.id === active.id);
    const to = fields.findIndex((f) => f.id === over.id);
    if (from < 0 || to < 0) return;
    move(from, to);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {fields.length === 0
            ? "Aucun produit phare."
            : `${fields.length} produit${fields.length > 1 ? "s" : ""}${
                fields.length > 1 ? " · glisser pour réordonner" : ""
              }`}
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({
              id: crypto.randomUUID(),
              nom: "",
              description: "",
              image: "",
              prix: "",
            })
          }
        >
          <Plus className="size-3.5" />
          Ajouter un produit
        </Button>
      </div>

      {fields.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToParentElement]}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={fields.map((f) => f.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {fields.map((field, index) => (
                <ProductCard
                  key={field.id}
                  id={field.id}
                  index={index}
                  onRemove={() => remove(index)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
