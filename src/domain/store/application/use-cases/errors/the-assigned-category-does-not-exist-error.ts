import { UseCaseError } from "src/core/errors/use-case-error";

export class TheAssignedCategoryDoesNotExistError
  extends Error
  implements UseCaseError
{
  constructor() {
    super("The Assigned Category Does Not Exist.");
  }
}
