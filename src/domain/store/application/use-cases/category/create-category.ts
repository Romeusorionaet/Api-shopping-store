import { Either, left, right } from "src/core/either";
import { CategoryRepository } from "../../repositories/category-repository";
import { Category } from "../../../enterprise/entities/category";
import { CategoryAlreadyExistsError } from "../errors/category-already-exists-error";

interface CreateCategoryUseCaseRequest {
  title: string;
  imgUrl: string;
}

type CreateCategoryUseCaseResponse = Either<
  CategoryAlreadyExistsError,
  {
    category: Category;
  }
>;

export class CreateCategoryUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute({
    title,
    imgUrl,
  }: CreateCategoryUseCaseRequest): Promise<CreateCategoryUseCaseResponse> {
    const existCategory = await this.categoryRepository.findByTitle(title);

    if (existCategory) {
      return left(new CategoryAlreadyExistsError(existCategory.title));
    }

    const category = Category.create({
      title,
      imgUrl,
    });

    await this.categoryRepository.create(category);

    return right({ category });
  }
}
