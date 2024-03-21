import { Either, left, right } from "src/core/either";
import { OrderRepository } from "../../repositories/order-repository";
import { Order } from "../../../enterprise/entities/order";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { OrderWithEmptyAddressError } from "../errors/order-with-empty-address-error";
import { BuyerAddressRepository } from "../../repositories/buyer-address-repository";
import { OrderProduct } from "src/domain/store/enterprise/entities/order-product";
import { UsersRepository } from "../../repositories/users-repository";
import { UserNotFoundError } from "src/core/errors/user-not-found-error";

interface PurchaseOrderUseCaseRequest {
  buyerId: string;
  addressId: string;
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
    private buyerAddressRepository: BuyerAddressRepository,
    private userRepository: UsersRepository,
  ) {}

  async execute({
    buyerId,
    addressId,
    orderProducts,
  }: PurchaseOrderUseCaseRequest): Promise<PurchaseOrderUseCaseResponse> {
    const address = await this.buyerAddressRepository.findById(addressId);

    const buyer = await this.userRepository.findById(buyerId);

    if (!buyer) {
      return left(new UserNotFoundError());
    }

    if (!address) {
      return left(new OrderWithEmptyAddressError());
    }

    const order = Order.create({
      buyerId: new UniqueEntityID(buyerId),
      buyerAddress: address,
      orderProducts,
    });

    await this.orderRepository.create(order);

    const buyerAddress = address.update({ orderId: order.id });

    await this.buyerAddressRepository.update(buyerAddress);

    return right({ order });
  }
}
