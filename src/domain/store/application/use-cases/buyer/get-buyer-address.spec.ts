import { InMemoryBuyerAddressRepository } from "test/repositories/in-memory-buyer-address-repository";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { makeBuyerAddress } from "test/factories/make-buyer-address";
import { GetBuyerAddressUseCase } from "./get-buyer-address";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { makeUser } from "test/factories/make-user";

let buyerAddressRepository: InMemoryBuyerAddressRepository;
let usersRepository: InMemoryUsersRepository;
let sut: GetBuyerAddressUseCase;

describe("Get buyer Address", () => {
  beforeEach(() => {
    buyerAddressRepository = new InMemoryBuyerAddressRepository();

    usersRepository = new InMemoryUsersRepository();

    sut = new GetBuyerAddressUseCase(buyerAddressRepository);
  });

  test("should be able to get buyer address by id", async () => {
    const user = await makeUser({}, new UniqueEntityID("user-test-id"));

    await usersRepository.create(user);

    const buyerAddress = makeBuyerAddress(
      { buyerId: user.id, orderId: new UniqueEntityID() },
      new UniqueEntityID("address id 01"),
    );

    await buyerAddressRepository.items.push(buyerAddress);

    const result = await sut.execute({
      buyerId: buyerAddress.buyerId.toString(),
    });

    expect(result.isRight()).toBe(true);

    expect(buyerAddressRepository.items).toHaveLength(1);

    if (result.isRight()) {
      expect(result.value.buyerAddress).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: new UniqueEntityID("address id 01"),
          }),
        ]),
      );
    }
  });
});
