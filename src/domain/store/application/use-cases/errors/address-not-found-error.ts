import { UseCaseError } from "src/core/errors/use-case-error";

export class AddressNotFoundError extends Error implements UseCaseError {
  constructor() {
    super("Endereço não encontrado");
  }
}
