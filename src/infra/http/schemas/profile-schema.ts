import { z } from "zod";

export const profileFromGoogleSchema = z.object({
  email: z.string(),
  username: z.string(),
  picture: z.string().optional(),
});

export const profileFromUserSchema = z.object({
  email: z.string(),
  username: z.string(),
  password: z.string(),
});
