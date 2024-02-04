import { Either, right } from "src/core/either";
import { Category } from "../../enterprise/entities/category";
import { CategoryRepository } from "../repositories/category-repository";

interface FetchCategoryUseCaseRequest {
  page: number;
}

type FetchCategoryUseCaseResponse = Either<
  null,
  {
    categories: Category[];
  }
>;

export class FetchCategoryUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute({
    page,
  }: FetchCategoryUseCaseRequest): Promise<FetchCategoryUseCaseResponse> {
    const categories = await this.categoryRepository.findMany({ page });

    return right({ categories });
  }
}
