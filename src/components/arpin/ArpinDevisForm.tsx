"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface FormState {
  nom: string;
  email: string;
  message: string;
}

const EMPTY: FormState = { nom: "", email: "", message: "" };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fieldClass =
  "w-full border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-foreground";

export default function ArpinDevisForm() {
  const [data, setData] = useState<FormState>(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    const nom = data.nom.trim();
    const email = data.email.trim();
    const message = data.message.trim();

    if (!nom || !email || !message) {
      toast.error("Merci de remplir tous les champs obligatoires.");
      return;
    }
    if (!EMAIL_RE.test(email)) {
      toast.error("Merci de saisir une adresse e-mail valide.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nom,
          email,
          subject: "Demande de devis Arpin",
          message,
          source: "arpin",
        }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.error ?? "Envoi impossible");
      }

      toast.success(
        "Demande envoyée. Notre équipe vous répondra dans les meilleurs délais."
      );
      setData(EMPTY);
    } catch (err) {
      toast.error(
        err instanceof Error && err.message
          ? err.message
          : "Une erreur est survenue. Merci de réessayer."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div>
        <label htmlFor="arpin-nom" className="eyebrow">
          Nom complet
        </label>
        <input
          id="arpin-nom"
          name="nom"
          type="text"
          autoComplete="name"
          value={data.nom}
          onChange={handleChange}
          placeholder="Votre nom"
          className={`mt-3 ${fieldClass}`}
          required
        />
      </div>

      <div>
        <label htmlFor="arpin-email" className="eyebrow">
          Adresse e-mail
        </label>
        <input
          id="arpin-email"
          name="email"
          type="email"
          autoComplete="email"
          value={data.email}
          onChange={handleChange}
          placeholder="vous@exemple.com"
          className={`mt-3 ${fieldClass}`}
          required
        />
      </div>

      <div>
        <label htmlFor="arpin-message" className="eyebrow">
          Votre projet
        </label>
        <textarea
          id="arpin-message"
          name="message"
          rows={5}
          value={data.message}
          onChange={handleChange}
          placeholder="Décrivez la pièce ou le projet qui vous intéresse (plaid, couverture, sur-mesure…)."
          className={`mt-3 resize-none ${fieldClass}`}
          required
        />
      </div>

      <Button type="submit" size="lg" disabled={submitting} className="w-full">
        {submitting ? "Envoi…" : "Envoyer ma demande"}
        {!submitting && <ArrowRight className="size-4" />}
      </Button>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Les champs sont obligatoires. Vos données sont utilisées uniquement pour
        traiter votre demande.
      </p>
    </form>
  );
}
