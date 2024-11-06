import { Either, right } from "src/core/either";
import { Category } from "../../../enterprise/entities/category";
import {
  CategoriesBasicDataProps,
  CategoryRepository,
} from "../../repositories/category-repository";

interface FetchCategoriesUseCaseRequest {
  page?: number;
}

type FetchCategoriesUseCaseResponse = Either<
  null,
  {
    categories: Category[] | CategoriesBasicDataProps[];
  }
>;

export class FetchCategoriesUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute({
    page,
  }: FetchCategoriesUseCaseRequest): Promise<FetchCategoriesUseCaseResponse> {
    const categories = await this.categoryRepository.findMany({ page });

    return right({ categories });
  }
}
