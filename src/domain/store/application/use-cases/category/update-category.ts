import { Either, left, right } from "src/core/either";
import { Category } from "../../../enterprise/entities/category";
import { CategoryRepository } from "../../repositories/category-repository";
import { ResourceNotFoundError } from "src/core/errors/resource-not-found-error";

interface UpdateCategoryUseCaseRequest {
  id: string;
  title: string;
  imgUrl: string;
}

type UpdateCategoryUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    categoryUpdated: Category;
  }
>;

export class UpdateCategoryUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute({
    id,
    title,
    imgUrl,
  }: UpdateCategoryUseCaseRequest): Promise<UpdateCategoryUseCaseResponse> {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      return left(new ResourceNotFoundError());
    }

    const categoryUpdated = category.update({
      title,
      imgUrl,
    });

    await this.categoryRepository.update(categoryUpdated);

    return right({ categoryUpdated });
  }
}
