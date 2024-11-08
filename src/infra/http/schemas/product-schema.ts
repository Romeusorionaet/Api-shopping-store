import { ModeOfSale } from "src/core/entities/mode-of-sale";
import { z } from "zod";

const baseProductSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Adicione um título ao seu produto." })
    .max(100, {
      message:
        "O Título do seu produto deve conter no máximo 100 caracteres. Informações mais detalhada do produto pode ser registrado em descrição do produto.",
    }),
  description: z
    .string()
    .min(1, { message: "Adicione uma descrição ao seu produto." }),
  price: z.coerce.number(),
  imgUrlList: z.array(z.string()),
  corsList: z.array(z.string()),
  stockQuantity: z.coerce.number(),
  minimumQuantityStock: z.coerce.number(),
  discountPercentage: z.coerce.number(),
  placeOfSale: z.nativeEnum(ModeOfSale),
  categoryId: z.string(),
  categoryTitle: z.string(),
});

const additionalProductCreateSchema = z.object({
  technicalProductDetails: z.object({
    width: z.string(),
    height: z.string(),
    weight: z.string(),
    brand: z.string(),
    model: z.string(),
    ram: z.string(),
    rom: z.string(),
    videoResolution: z.string(),
    batteryCapacity: z.string(),
    screenOrWatchFace: z.string(),
    averageBatteryLife: z.string(),
    videoCaptureResolution: z.string(),
    processorBrand: z.string(),
    operatingSystem: z.string(),
  }),
});

const additionalProductUpdateSchema = z.object({
  id: z.string().uuid(),
  technicalProductId: z.string().uuid(),
  technicalProductDetails: z.object({
    width: z.string(),
    height: z.string(),
    weight: z.string(),
    brand: z.string(),
    model: z.string(),
    ram: z.string(),
    rom: z.string(),
    videoResolution: z.string(),
    batteryCapacity: z.string(),
    screenOrWatchFace: z.string(),
    averageBatteryLife: z.string(),
    videoCaptureResolution: z.string(),
    processorBrand: z.string(),
    operatingSystem: z.string(),
  }),
});

export const productCreateSchema = z.object({
  product: additionalProductCreateSchema.merge(baseProductSchema),
});

export const productUpdateSchema = z.object({
  product: additionalProductUpdateSchema.merge(baseProductSchema),
});
