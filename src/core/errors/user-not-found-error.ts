import { UseCaseError } from "./use-case-error";

export class UserNotFoundError extends Error implements UseCaseError {
  constructor() {
    super("User not found.");
  }
}
