import { UseCaseError } from "src/core/errors/use-case-error";

export class EmailAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`This e-mail "${identifier}" Already Exists.`);
  }
}
