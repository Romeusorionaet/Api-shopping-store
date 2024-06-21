import { UseCaseError } from "src/core/errors/use-case-error";

export class InsufficientProductInventoryError
  extends Error
  implements UseCaseError
{
  constructor(identifier: string) {
    super(
      `A quantidade requisitado para o produto [ ${identifier} ] é superior ao que tem em estoque`,
    );
  }
}
