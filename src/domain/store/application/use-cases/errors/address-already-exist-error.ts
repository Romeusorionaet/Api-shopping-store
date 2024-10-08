import { UseCaseError } from "src/core/errors/use-case-error";

export class AddressAlreadyExistError extends Error implements UseCaseError {
  constructor() {
    super("Este endereço já existe");
  }
}
