import { PrismaCategoryRepository } from "src/infra/database/prisma/repositories/prisma-category-repository";
import { CreateCategoryUseCase } from "../category/create-category";

export function makeCreateCategoryUseCase() {
  const categoryRepository = new PrismaCategoryRepository();
  const useCase = new CreateCategoryUseCase(categoryRepository);

  return useCase;
}
