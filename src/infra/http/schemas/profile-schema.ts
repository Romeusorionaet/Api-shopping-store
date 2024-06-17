import { z } from "zod";

export const profileFromGoogleSchema = z.object({
  email: z.string(),
  username: z.string(),
  picture: z.string(),
  emailVerified: z.boolean(),
});

export const profileFromUserSchema = z.object({
  email: z.string(),
  username: z.string(),
  password: z.string(),
  picture: z.string().url("A imagem de perfil deve ser uma URL válida."),
});
