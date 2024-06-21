import { z } from "zod";

export const profileFromGoogleSchema = z.object({
  email: z.string(),
  username: z.string(),
  picture: z.string(),
  emailVerified: z.boolean(),
});

export const profileFromUserSchema = z.object({
  email: z.string().email("Precisa ser um email válido"),
  username: z.string().min(6, { message: "Nome e sobrenome é obrigatório" }),
  password: z.string().min(6, { message: "No mínimo 6 digitos" }),
  picture: z.string().url("A imagem de perfil deve ser uma URL válida"),
});
