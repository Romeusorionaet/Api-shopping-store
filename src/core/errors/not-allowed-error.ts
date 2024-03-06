import { UseCaseError } from "./use-case-error";

export class NotAllowedError extends Error implements UseCaseError {
  constructor() {
    super("Method Not Allowed.");
  }
}
