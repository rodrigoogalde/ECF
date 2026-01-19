import { z } from "zod";

export const questionSchema = z.object({
  uniqueCode: z.string().min(1, "El código único es requerido"),
  title: z.string().min(1, "El título es requerido"),
  content: z.string().min(1, "El contenido es requerido"),
  period: z.string().min(1, "El período es requerido"),
  type: z.string().min(1, "El tipo es requerido"),
  solution: z.string().optional(),
  imageUrl: z.array(z.url("Debe ser una URL válida")).default([]),
  correctLabel: z.string().optional(),
  courseCode: z.string().min(1, "El código del curso es requerido"),
});

export type QuestionFormData = z.infer<typeof questionSchema>;
