"use client";

import { useFormContext } from "react-hook-form";
import type { MarqueFormValues } from "@/lib/schemas/marque";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function DescriptionsSection() {
  const { register } = useFormContext<MarqueFormValues>();

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="description">Description courte</Label>
        <Textarea
          id="description"
          rows={2}
          {...register("description")}
          placeholder="Phrase d’accroche affichée en tête de la page marque."
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="description_fr">Description (FR)</Label>
          <Textarea id="description_fr" rows={5} {...register("description_fr")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description_en">Description (EN)</Label>
          <Textarea id="description_en" rows={5} {...register("description_en")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="histoire">Histoire &amp; valeurs</Label>
        <Textarea
          id="histoire"
          rows={5}
          {...register("histoire")}
          placeholder="Récit de la maison, savoir-faire, valeurs…"
        />
      </div>
    </div>
  );
}
