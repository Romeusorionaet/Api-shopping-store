import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().default(3333),
  JWT_PRIVATE_KEY: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET_ID: z.string(),
  GOOGLE_CLIENT_REDIRECT_URL: z.string(),
  EFI_CLIENT_KEY_ID: z.string(),
  EFI_SECRET_KEY: z.string(),
  EFI_CERTIFICATE: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("Invalid environment variables", _env.error.format());

  throw new Error("Invalid environment variables.");
}

export const env = _env.data;
