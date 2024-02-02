import { Either, right } from "src/core/either";
import { CategoryRepository } from "../repositories/category-repository";
import { Category } from "../../enterprise/entities/category";

interface CreateCategoryUseCaseRequest {
  title: string;
  productQuantity: number;
  imgUrl: string;
}

type CreateCategoryUseCaseResponse = Either<
  null,
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
    const category = Category.create({
      title,
      productQuantity,
      imgUrl,
    });

    await this.categoryRepository.create(category);

    return right({ category });
  }
}
