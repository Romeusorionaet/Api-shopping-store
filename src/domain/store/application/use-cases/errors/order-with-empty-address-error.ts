import { UseCaseError } from "src/core/errors/use-case-error";

export class OrderWithEmptyAddressError extends Error implements UseCaseError {
  constructor() {
    super("Este pedido está sem endereço cadastrado");
  }
}
