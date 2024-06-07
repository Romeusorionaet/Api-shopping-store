import { z } from "zod";

export const categoryCreateSchema = z.object({
  title: z.string().min(1, { message: "Título obrigatório." }),
  imgUrl: z.string().min(1, { message: "Url da imagem obrigatório." }),
});

export const categoryUpdateSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, { message: "Título obrigatório." }),
  imgUrl: z.string().min(1, { message: "Url da imagem obrigatório." }),
});
