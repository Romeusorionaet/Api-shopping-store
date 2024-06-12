import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().optional().default(3333),
  JWT_PRIVATE_KEY: z.string(),
  COOKIE_PRIVATE_KEY: z.string(),
  DOMAIN_COOKIE_TOKEN: z.string(),
  SHOPPING_STORE_URL_WEB: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET_ID: z.string(),
  GOOGLE_CLIENT_REDIRECT_URL: z.string(),
  STRIPE_PUBLIC_KEY: z.string(),
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET_KEY: z.string(),
  STRIPE_SUCCESS_URL: z.string(),
  STRIPE_CANCEL_URL: z.string(),
  REDIS_HOST: z.string().optional().default("127.0.0.1"),
  REDIS_PORT: z.coerce.number().optional().default(6379),
  REDIS_DB: z.coerce.number().optional().default(0),
  UPSTASH_REDIS_PASSWORD: z.string(),
  UPSTASH_REDIS_URL: z.string(),
});
