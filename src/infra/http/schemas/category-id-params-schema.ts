import { z } from "zod";

export const categoryIdParamsSchema = z.object({
  categoryId: z.string().uuid(),
});
