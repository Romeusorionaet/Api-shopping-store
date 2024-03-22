import { Either, left, right } from "src/core/either";
import { CategoryRepository } from "../../repositories/category-repository";
import { ResourceNotFoundError } from "src/core/errors/resource-not-found-error";

interface RemoveCategoryUseCaseRequest {
  id: string;
}

type RemoveCategoryUseCaseResponse = Either<ResourceNotFoundError, object>;

export class RemoveCategoryUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute({
    id,
  }: RemoveCategoryUseCaseRequest): Promise<RemoveCategoryUseCaseResponse> {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      return left(new ResourceNotFoundError());
    }

    await this.categoryRepository.remove(id);

    return right({});
  }
}
