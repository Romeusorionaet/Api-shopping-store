import { PrismaCategoryRepository } from "src/infra/database/prisma/repositories/prisma-category-repository";
import { GetCategoryDetailsUseCase } from "../category/get-category-details";

export function makeGetCategoryDetailsUseCase() {
  const categoryRepository = new PrismaCategoryRepository();
  const useCase = new GetCategoryDetailsUseCase(categoryRepository);

  return useCase;
}
