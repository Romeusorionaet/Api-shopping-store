import { UseCaseError } from "src/core/errors/use-case-error";

export class OrderNotFoundError extends Error implements UseCaseError {
  constructor() {
    super("Pedido não encontrado");
  }
}
