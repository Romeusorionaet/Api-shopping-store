import { UseCaseError } from "src/core/errors/use-case-error";

export class EmailNotVerifiedError extends Error implements UseCaseError {
  constructor() {
    super("Este email ainda não foi validado");
  }
}
