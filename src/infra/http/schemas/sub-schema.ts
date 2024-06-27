import { z } from "zod";

export const subSchema = z.object({
  sub: z.string().uuid("O endereço ID privado é necessário"),
  publicId: z.string().uuid("O endereço ID público é necessário"),
});
