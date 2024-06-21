import { UseCaseError } from "src/core/errors/use-case-error";

export class ProductNotFoundError extends Error implements UseCaseError {
  constructor(identifier?: string) {
    super(`O produto [ ${identifier} ] não foi encontrado`);
  }
}
