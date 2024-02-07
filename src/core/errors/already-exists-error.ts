import { UseCaseError } from "./use-case-error";

export class AlreadyExistsError extends Error implements UseCaseError {
  constructor() {
    super("Already Exists.");
  }
}
