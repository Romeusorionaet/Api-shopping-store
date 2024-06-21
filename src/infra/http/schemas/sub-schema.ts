import { z } from "zod";

export const subSchema = z.object({
  sub: z.string().uuid("Um endereço ID é necessário"),
});
