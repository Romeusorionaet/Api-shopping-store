import { UseCaseError } from "src/core/errors/use-case-error";

export class ProductIsOutOfStockError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`The product [ ${identifier} ] is out of stock.`);
  }
}
