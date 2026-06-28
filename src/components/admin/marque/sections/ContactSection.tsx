"use client";

import { useFormContext } from "react-hook-form";
import type { MarqueFormValues } from "@/lib/schemas/marque";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ContactSection() {
  const { register } = useFormContext<MarqueFormValues>();

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-email">Email</Label>
          <Input id="contact-email" type="email" {...register("contact.email")} />
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

      {/* Variantes anglophones héritées — conservées pour ne rien perdre. */}
      <details className="group rounded-md border border-border bg-secondary/30 px-4 py-3">
        <summary className="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-foreground">
          Variantes anglophones (héritées)
        </summary>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="contact-address-en">Adresse (address)</Label>
            <Input id="contact-address-en" {...register("contact.address")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-phone-en">Téléphone (phone)</Label>
            <Input id="contact-phone-en" {...register("contact.phone")} />
          </div>
        </div>
      </details>
    </div>
  );
}
