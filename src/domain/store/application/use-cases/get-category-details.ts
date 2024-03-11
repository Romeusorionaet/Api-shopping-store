import { Either, left, right } from "src/core/either";
import { Category } from "../../enterprise/entities/category";
import { CategoryRepository } from "../repositories/category-repository";
import { ResourceNotFoundError } from "src/core/errors/resource-not-found-error";

interface GetCategoryDetailsUseCaseRequest {
  id: string;
}

type GetCategoryDetailsUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    category: Category;
  }
>;

export class GetCategoryDetailsUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute({
    id,
  }: GetCategoryDetailsUseCaseRequest): Promise<GetCategoryDetailsUseCaseResponse> {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      return left(new ResourceNotFoundError());
    }

    return right({ category });
  }
}
