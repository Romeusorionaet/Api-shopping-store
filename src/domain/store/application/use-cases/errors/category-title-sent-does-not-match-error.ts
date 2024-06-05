import { UseCaseError } from "src/core/errors/use-case-error";

export class CategoryTitleSentDoesNotMatchError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(
      "O título da categoria deve ser o mesmo do endereço da categoria registrado.",
    );
  }
}
