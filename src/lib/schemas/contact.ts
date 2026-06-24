import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Veuillez indiquer votre nom."),
  email: z.string().trim().email("Adresse e-mail invalide."),
  subject: z.string().trim().min(2, "Veuillez préciser un sujet."),
  message: z
    .string()
    .trim()
    .min(10, "Votre message doit contenir au moins 10 caractères."),
  source: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
