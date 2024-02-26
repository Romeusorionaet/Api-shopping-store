import { Either, left, right } from "src/core/either";
import { CategoryRepository } from "../repositories/category-repository";
import { CategoryAlreadyExistsError } from "src/core/errors/category-already-exists-error";
import { Category } from "../../enterprise/entities/category";

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
    const categoryList = await this.categoryRepository.getByTitle(title);

    const existCategoryInList = categoryList.length !== 0;

    if (existCategoryInList) {
      return left(new CategoryAlreadyExistsError());
    }

    const category = Category.create({
      title,
      imgUrl,
    });

    await this.categoryRepository.create(category);

    return right({ category });
  }
}
