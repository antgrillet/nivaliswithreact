"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";
import { contactSchema } from "@/lib/schemas/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const EMPTY = { name: "", email: "", subject: "", message: "" };
type Field = keyof typeof EMPTY;

export default function ContactForm() {
  const [data, setData] = useState(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const update =
    (key: Field) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setData((prev) => ({ ...prev, [key]: e.target.value }));
      if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
      if (sent) setSent(false);
    };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        subject: fieldErrors.subject?.[0],
        message: fieldErrors.message?.[0],
      });
      return;
    }

    setErrors({});
    setSent(false);
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error("request failed");
      setData(EMPTY);
      setSent(true);
      toast.success("Message envoyé", {
        description: "Merci, nous vous répondrons dans les plus brefs délais.",
      });
    } catch {
      toast.error("Échec de l'envoi", {
        description: "Une erreur est survenue. Veuillez réessayer plus tard.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="space-y-2">
        <Label htmlFor="name">Nom complet</Label>
        <Input
          id="name"
          value={data.name}
          onChange={update("name")}
          placeholder="Jean Dupont"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <p
            id="name-error"
            role="alert"
            aria-live="polite"
            className="text-xs text-destructive"
          >
            {errors.name}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          value={data.email}
          onChange={update("email")}
          placeholder="vous@exemple.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <p
            id="email-error"
            role="alert"
            aria-live="polite"
            className="text-xs text-destructive"
          >
            {errors.email}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Sujet</Label>
        <Input
          id="subject"
          value={data.subject}
          onChange={update("subject")}
          placeholder="Disponibilité d'une marque, conseil…"
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? "subject-error" : undefined}
        />
        {errors.subject && (
          <p
            id="subject-error"
            role="alert"
            aria-live="polite"
            className="text-xs text-destructive"
          >
            {errors.subject}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          rows={5}
          value={data.message}
          onChange={update("message")}
          placeholder="Dites-nous en quelques mots ce qui vous amène…"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message && (
          <p
            id="message-error"
            role="alert"
            aria-live="polite"
            className="text-xs text-destructive"
          >
            {errors.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full disabled:opacity-70"
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Envoi…
          </>
        ) : (
          "Envoyer le message"
        )}
      </Button>

      {sent && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-start gap-3 border border-border bg-secondary px-4 py-3 text-sm animate-fadeSlideUp"
        >
          <CheckCircle2
            className="mt-0.5 size-5 shrink-0 text-foreground"
            aria-hidden="true"
          />
          <p className="leading-relaxed text-muted-foreground">
            <span className="text-foreground">Message envoyé, merci.</span> Nous
            revenons vers vous rapidement.
          </p>
        </div>
      )}
    </form>
  );
}
