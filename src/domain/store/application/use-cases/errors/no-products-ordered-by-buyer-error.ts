import { UseCaseError } from "src/core/errors/use-case-error";

export class NoProductsOrderedByBuyerError
  extends Error
  implements UseCaseError
{
  constructor() {
    super("No products ordered by buyer.");
  }
}
