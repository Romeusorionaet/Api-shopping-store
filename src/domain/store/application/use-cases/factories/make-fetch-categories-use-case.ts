import { PrismaCategoryRepository } from "src/infra/database/prisma/repositories/prisma-category-repository";
import { FetchCategoriesUseCase } from "../fetch-categories";

export function makeFetchCategoriesUseCase() {
  const categoryRepository = new PrismaCategoryRepository();
  const useCase = new FetchCategoriesUseCase(categoryRepository);

  return useCase;
}
