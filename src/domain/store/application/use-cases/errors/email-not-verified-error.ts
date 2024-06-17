import { UseCaseError } from "src/core/errors/use-case-error";

export class EmailNotVerifiedError extends Error implements UseCaseError {
  constructor() {
    super(
      "O seu email não está verificado. Por favor, verifique seu email para continuar.",
    );
  }
}
