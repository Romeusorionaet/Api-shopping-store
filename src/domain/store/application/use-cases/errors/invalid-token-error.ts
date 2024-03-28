import { UseCaseError } from "src/core/errors/use-case-error";

export class InvalidTokenError extends Error implements UseCaseError {
  constructor() {
    super("Invalid token.");
  }
}
