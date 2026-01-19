import { z } from "zod";

export const optionSchema = z.object({
  label: z.string().min(1, "La etiqueta es requerida"),
  text: z.string().min(1, "El texto es requerido"),
  imageUrl: z.array(z.url("Debe ser una URL válida")).default([]),
  questionCode: z.string().min(1, "El código de la pregunta es requerido"),
});

export type OptionFormData = z.infer<typeof optionSchema>;
