import { Either, left, right } from "src/core/either";
import { Product } from "../../../enterprise/entities/product";
import { ProductRepository } from "../../repositories/product-repository";
import { ProductNotFoundError } from "../errors/product-not-found-error";
import { SectionForSearch } from "../../constants/section-for-search";
import { ProductRatingRepository } from "../../repositories/product-rating-repository";

interface SearchProductsUseCaseRequest {
  query: string;
  section: string | null;
  page: number;
}

type SearchProductsUseCaseResponse = Either<
  ProductNotFoundError,
  {
    products: Product[];
  }
>;

export class SearchProductsUseCase {
  constructor(
    private productRepository: ProductRepository,
    private ProductRatingRepository: ProductRatingRepository,
  ) {}

  async execute({
    query,
    section,
    page,
  }: SearchProductsUseCaseRequest): Promise<SearchProductsUseCaseResponse> {
    const thisIsStarsSection =
      section && section === SectionForSearch.STARS && !query;

    if (thisIsStarsSection) {
      const products = await this.ProductRatingRepository.findManyByStars(page);

      if (!products) {
        return left(new ProductNotFoundError(query));
      }

      return right({ products });
    }

    const thisIsDiscountPercentageSection =
      section && section === SectionForSearch.DISCOUNT_PERCENTAGE && !query;

    if (thisIsDiscountPercentageSection) {
      const products =
        await this.ProductRatingRepository.findManyByDiscountPercentage(page);

      if (!products) {
        return left(new ProductNotFoundError(query));
      }

      return right({ products });
    }

    const products = await this.productRepository.searchMany(query, page);

    if (!products) {
      return left(new ProductNotFoundError(query));
    }

    return right({ products });
  }
}
