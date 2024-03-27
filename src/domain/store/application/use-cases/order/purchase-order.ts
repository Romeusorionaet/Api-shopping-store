import { Either, left, right } from "src/core/either";
import { OrderRepository } from "../../repositories/order-repository";
import { Order } from "../../../enterprise/entities/order";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { OrderWithEmptyAddressError } from "../errors/order-with-empty-address-error";
import { OrderProduct } from "src/domain/store/enterprise/entities/order-product";
import { UsersRepository } from "../../repositories/users-repository";
import { UserNotFoundError } from "src/core/errors/user-not-found-error";
import { BuyerAddress } from "src/domain/store/enterprise/entities/buyer-address";
import { UserAddress } from "src/domain/store/enterprise/entities/user-address";
import { UserAddressRepository } from "../../repositories/user-address-repository";

interface PurchaseOrderUseCaseRequest {
  buyerId: string;
  userAddress: UserAddress;
  orderProducts: OrderProduct[];
}

type PurchaseOrderUseCaseResponse = Either<
  OrderWithEmptyAddressError | UserNotFoundError,
  {
    order: Order;
  }
>;

export class PurchaseOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private userAddressRepository: UserAddressRepository,
    private userRepository: UsersRepository,
  ) {}

  async execute({
    buyerId,
    userAddress,
    orderProducts,
  }: PurchaseOrderUseCaseRequest): Promise<PurchaseOrderUseCaseResponse> {
    const address = await this.userAddressRepository.findByUserId(buyerId);

    const buyer = await this.userRepository.findById(buyerId);

    if (!buyer) {
      return left(new UserNotFoundError());
    }

    if (!address) {
      return left(new OrderWithEmptyAddressError());
    }
    const buyerAddress = BuyerAddress.create({
      buyerId: userAddress.userId,
      username: address.username,
      cep: userAddress.cep,
      city: userAddress.city,
      complement: userAddress.complement,
      email: userAddress.email,
      houseNumber: userAddress.houseNumber,
      neighborhood: address.neighborhood,
      phoneNumber: address.phoneNumber,
      street: address.street,
      uf: address.uf,
    });

    const order = Order.create({
      buyerId: new UniqueEntityID(buyerId),
      buyerAddress,
      orderProducts,
    });

    await this.orderRepository.create(order);

    return right({ order });
  }
}
