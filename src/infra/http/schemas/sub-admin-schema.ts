import { z } from "zod";

export const subAdminSchema = z.object({
  sub: z.string().uuid("Não autorizado"),
  publicId: z.string().uuid("Não autorizado"),
  staffId: z.string().uuid("Não autorizado"),
  role: z.string(),
});
