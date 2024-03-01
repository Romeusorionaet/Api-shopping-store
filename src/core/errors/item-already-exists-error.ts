import { UseCaseError } from "./use-case-error";

export class ItemAlreadyExistsError extends Error implements UseCaseError {
  constructor() {
    super("This Item Already Exists.");
  }
}
