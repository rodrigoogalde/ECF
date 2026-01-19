import { z } from "zod";

export const userSchema = z.object({
  email: z.string().email("Debe ser un email válido"),
  name: z.string().optional(),
});

export type UserFormData = z.infer<typeof userSchema>;
