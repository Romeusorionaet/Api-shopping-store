import { PrismaCategoryRepository } from "src/infra/database/prisma/repositories/prisma-category-repository";
import { RemoveCategoryUseCase } from "../category/remove-category";

export function makeRemoveCategoryUseCase() {
  const categoryRepository = new PrismaCategoryRepository();
  const useCase = new RemoveCategoryUseCase(categoryRepository);

  return useCase;
}
