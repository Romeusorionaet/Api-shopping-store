import { UseCaseError } from "src/core/errors/use-case-error";

export class CategoryAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Este nome de categoria "${identifier}" já existe`);
  }
}
