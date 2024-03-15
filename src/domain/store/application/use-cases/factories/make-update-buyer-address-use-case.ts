import { PrismaBuyerAddressRepository } from "src/infra/database/prisma/repositories/prisma-buyer-address-repository";
import { UpdateBuyerAddressUseCase } from "../buyer/update-buyer-address";

export function makeUpdateBuyerAddressUseCase() {
  const updateBuyerAddressRepository = new PrismaBuyerAddressRepository();

  const useCase = new UpdateBuyerAddressUseCase(updateBuyerAddressRepository);

  return useCase;
}
