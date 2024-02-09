import { UseCaseError } from "./use-case-error";

export class CategoryAlreadyExistsError extends Error implements UseCaseError {
  constructor() {
    super("Category Already Exists.");
  }
}
