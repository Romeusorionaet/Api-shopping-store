import { PrismaCategoryRepository } from "src/infra/database/prisma/repositories/prisma-category-repository";
import { UpdateCategoryUseCase } from "../update-category";

export function makeUpdateCategoryUseCase() {
  const categoryRepository = new PrismaCategoryRepository();
  const useCase = new UpdateCategoryUseCase(categoryRepository);

  return useCase;
}
