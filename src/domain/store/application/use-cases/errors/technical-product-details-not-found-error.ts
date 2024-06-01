import { UseCaseError } from "src/core/errors/use-case-error";

export class TechnicalProductNotFoundError
  extends Error
  implements UseCaseError
{
  constructor() {
    super("Detalhes técnicos do produto não encontrado.");
  }
}
