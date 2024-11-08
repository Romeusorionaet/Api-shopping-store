import { SectionForSearch } from "src/core/constants/section-for-search";
import { z } from "zod";

export const searchProductSchema = z.object({
  query: z.string().default(""),
  section: z
    .enum([SectionForSearch.DISCOUNT_PERCENTAGE, SectionForSearch.STARS])
    .nullable()
    .default(null),
  page: z.coerce.number().min(1).default(1),
  categoryId: z.string().nullable().default(null),
});
