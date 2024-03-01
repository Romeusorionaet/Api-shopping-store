import { Either, left, right } from "src/core/either";
import { CategoryRepository } from "../repositories/category-repository";
import { ItemAlreadyExistsError } from "src/core/errors/item-already-exists-error";
import { Category } from "../../enterprise/entities/category";

interface CreateCategoryUseCaseRequest {
  title: string;
  imgUrl: string;
}

type CreateCategoryUseCaseResponse = Either<
  ItemAlreadyExistsError,
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
      return left(new ItemAlreadyExistsError());
    }

    const category = Category.create({
      title,
      imgUrl,
    });

    await this.categoryRepository.create(category);

    return right({ category });
  }
}
