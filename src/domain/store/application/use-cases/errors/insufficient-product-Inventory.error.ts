import { UseCaseError } from "src/core/errors/use-case-error";

export class InsufficientProductInventoryError
  extends Error
  implements UseCaseError
{
  constructor(identifier: string) {
    super(
      `The quantity ordered for the product [ ${identifier} ] exceeds the available inventory.`,
    );
  }
}
