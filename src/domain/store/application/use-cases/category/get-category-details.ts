import { Either, left, right } from "src/core/either";
import { Category } from "../../../enterprise/entities/category";
import { CategoryRepository } from "../../repositories/category-repository";
import { ResourceNotFoundError } from "src/core/errors/resource-not-found-error";
import { ProductRepository } from "../../repositories/product-repository";

interface GetCategoryDetailsUseCaseRequest {
  id: string;
}

type GetCategoryDetailsUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    category: Category;
    countProductPerCategory: number;
  }
>;

export class GetCategoryDetailsUseCase {
  constructor(
    private categoryRepository: CategoryRepository,
    private productRepository: ProductRepository,
  ) {}

  async execute({
    id,
  }: GetCategoryDetailsUseCaseRequest): Promise<GetCategoryDetailsUseCaseResponse> {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      return left(new ResourceNotFoundError());
    }

    const countProductPerCategory =
      await this.productRepository.countByCategoryId(id);

    return right({ category, countProductPerCategory });
  }
}
