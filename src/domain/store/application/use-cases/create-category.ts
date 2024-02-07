import { Either, left, right } from "src/core/either";
import { CategoryRepository } from "../repositories/category-repository";
import { Category } from "../../enterprise/entities/category";
import { AlreadyExistsError } from "src/core/errors/already-exists-error";

interface CreateCategoryUseCaseRequest {
  title: string;
  productQuantity: number;
  imgUrl: string;
}

type CreateCategoryUseCaseResponse = Either<
  AlreadyExistsError,
  {
    category: Category;
  }
>;

export class CreateCategoryUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute({
    title,
    productQuantity,
    imgUrl,
  }: CreateCategoryUseCaseRequest): Promise<CreateCategoryUseCaseResponse> {
    const existCategory = await this.categoryRepository.getByTitle(title);

    if (existCategory) {
      return left(new AlreadyExistsError());
    }

    const category = Category.create({
      title,
      productQuantity,
      imgUrl,
    });

    await this.categoryRepository.create(category);

    return right({ category });
  }
}
