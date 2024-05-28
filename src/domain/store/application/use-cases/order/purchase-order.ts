import { Either, left, right } from "src/core/either";
import { OrderRepository } from "../../repositories/order-repository";
import { Order } from "../../../enterprise/entities/order";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { OrderWithEmptyAddressError } from "../errors/order-with-empty-address-error";
import {
  OrderProduct,
  OrderProductProps,
} from "src/domain/store/enterprise/entities/order-product";
import { UsersRepository } from "../../repositories/users-repository";
import { UserNotFoundError } from "src/core/errors/user-not-found-error";
import { BuyerAddress } from "src/domain/store/enterprise/entities/buyer-address";
import { UserAddressRepository } from "../../repositories/user-address-repository";
import { ProductRepository } from "../../repositories/product-repository";
import { ProductNotFoundError } from "../errors/product-not-found-error";
import { ProductIsOutOfStockError } from "../errors/product-is-out-of-stock-error";
import { InsufficientProductInventoryError } from "../errors/insufficient-product-Inventory.error";

interface PurchaseOrderUseCaseRequest {
  buyerId: string;
  orderProducts: OrderProductProps[];
}

type PurchaseOrderUseCaseResponse = Either<
  | OrderWithEmptyAddressError
  | UserNotFoundError
  | ProductNotFoundError
  | ProductIsOutOfStockError,
  {
    order: Order;
  }
>;

export class PurchaseOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private userAddressRepository: UserAddressRepository,
    private userRepository: UsersRepository,
    private productRepository: ProductRepository,
  ) {}

  async execute({
    buyerId,
    orderProducts,
  }: PurchaseOrderUseCaseRequest): Promise<PurchaseOrderUseCaseResponse> {
    const outOfStockProducts = [];
    const insufficientProductInventory = [];

    const address = await this.userAddressRepository.findByUserId(buyerId);

    const buyer = await this.userRepository.findById(buyerId);

    if (!buyer) {
      return left(new UserNotFoundError());
    }

    if (!address) {
      return left(new OrderWithEmptyAddressError());
    }

    for (const orderProduct of orderProducts) {
      const product = await this.productRepository.findByTitle(
        orderProduct.title,
      );

      if (!product) {
        return left(new ProductNotFoundError());
      }

      if (product.stockQuantity < orderProduct.quantity) {
        insufficientProductInventory.push(product.title);
      }

      if (product.stockQuantity <= 0) {
        outOfStockProducts.push(product.title);
      }

      await this.orderRepository.removeDuplicatedOrders(
        buyerId,
        orderProduct.productId.toString(),
      );
    }

    if (outOfStockProducts.length > 0) {
      return left(new ProductIsOutOfStockError(outOfStockProducts.join(", ")));
    }

    if (insufficientProductInventory.length > 0) {
      return left(
        new InsufficientProductInventoryError(
          insufficientProductInventory.join(", "),
        ),
      );
    }

    const buyerAddress = BuyerAddress.create({
      buyerId: address.userId,
      username: address.username,
      cep: address.cep,
      city: address.city,
      complement: address.complement,
      email: address.email,
      houseNumber: address.houseNumber,
      neighborhood: address.neighborhood,
      phoneNumber: address.phoneNumber,
      street: address.street,
      uf: address.uf,
    });

    const newOrderProducts = orderProducts.map((product) => {
      return OrderProduct.create({
        productId: product.productId,
        title: product.title,
        imgUrl: product.imgUrl,
        basePrice: product.basePrice,
        discountPercentage: product.discountPercentage,
        quantity: product.quantity,
        colorList: product.colorList,
      });
    });

    const order = Order.create({
      buyerId: new UniqueEntityID(buyerId),
      buyerAddress,
      orderProducts: newOrderProducts,
    });

    await this.orderRepository.create(order);

    return right({ order });
  }
}
