import { z } from "zod";

export const signupostRequestBodySchema = z.object({
  firstname: z.string(),
  lastname: z.string().optional(),
  email: z.email(),
  password: z.string().min(8),
});

export const loginpostRequestBodySchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});
