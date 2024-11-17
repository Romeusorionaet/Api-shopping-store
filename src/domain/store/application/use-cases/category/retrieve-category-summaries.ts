import { Either, right } from "src/core/either";
import {
  CategoryRepository,
  CategorySummariesType,
} from "../../repositories/category-repository";

type RetrieveCategorySummariesUseCaseResponse = Either<
  null,
  {
    categorySummaries: CategorySummariesType[];
  }
>;

export class RetrieveCategorySummariesUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute(): Promise<RetrieveCategorySummariesUseCaseResponse> {
    const categorySummaries =
      await this.categoryRepository.findManyCategorySummaries();

    return right({ categorySummaries });
  }
}
