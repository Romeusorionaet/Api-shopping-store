import { PrismaCategoryRepository } from "../../repositories/prisma/prisma-product-repository";
import { CreateCategoryUseCase } from "../create-category";

export function makeCreateCategoryUseCase() {
  const categoryRepository = new PrismaCategoryRepository();
  const useCase = new CreateCategoryUseCase(categoryRepository);

  return useCase;
}
