import { Either, left, right } from "src/core/either";
import { CategoryRepository } from "../repositories/category-repository";
import { CategoryAlreadyExistsError } from "src/core/errors/category-already-exists-error";
import { Category } from "../../enterprise/entities/category";

interface CreateCategoryUseCaseRequest {
  title: string;
  productQuantity: number;
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
    productQuantity,
    imgUrl,
  }: CreateCategoryUseCaseRequest): Promise<CreateCategoryUseCaseResponse> {
    const categoryList = await this.categoryRepository.getByTitle(title);

    const existCategoryInList = categoryList.length !== 0;

    if (existCategoryInList) {
      return left(new CategoryAlreadyExistsError());
    }

    const category = Category.create({
      title,
      productQuantity,
      imgUrl,
    });

    const categoryWithIdAsString = {
      id: category.id.toString(),
      title: category.title,
      slug: category.slug.toString(),
      productQuantity: category.productQuantity,
      imgUrl: category.imgUrl,
    };

    await this.categoryRepository.create(categoryWithIdAsString);

    return right({ category });
  }
}
