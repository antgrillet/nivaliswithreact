import { z } from "zod";

export const contentUpdateSchema = z.object({
  section: z.string().trim().min(1, "Section requise"),
  subsection: z.string().trim().min(1, "Sous-section requise"),
  content: z.record(z.string(), z.unknown()),
});

export type ContentUpdateInput = z.infer<typeof contentUpdateSchema>;
