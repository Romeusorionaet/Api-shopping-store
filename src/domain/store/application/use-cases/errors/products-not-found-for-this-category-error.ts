import { UseCaseError } from "src/core/errors/use-case-error";

export class ProductsNotFoundForThisCategoryError
  extends Error
  implements UseCaseError
{
  constructor() {
    super("Nem um produto com essa categoria foi encontrado.");
  }
}
