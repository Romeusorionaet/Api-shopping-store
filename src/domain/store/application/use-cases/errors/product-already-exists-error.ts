import { UseCaseError } from "src/core/errors/use-case-error";

export class ProductAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`O nome do produto "${identifier}" já existe`);
  }
}
