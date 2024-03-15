import { PrismaBuyerAddressRepository } from "src/infra/database/prisma/repositories/prisma-buyer-address-repository";
import { GetBuyerAddressUseCase } from "../buyer/get-buyer-address";

export function makeGetBuyerAddressUseCase() {
  const buyerAddressRepository = new PrismaBuyerAddressRepository();

  const useCase = new GetBuyerAddressUseCase(buyerAddressRepository);

  return useCase;
}
