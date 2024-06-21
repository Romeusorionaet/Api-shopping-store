import { UseCaseError } from "src/core/errors/use-case-error";

export class TheAssignedCategoryDoesNotExistError
  extends Error
  implements UseCaseError
{
  constructor() {
    super("A categoria atribuída não existe");
  }
}
