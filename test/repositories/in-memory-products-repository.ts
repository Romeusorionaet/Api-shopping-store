/* eslint-disable array-callback-return */
import { PaginationParams } from "src/core/repositories/pagination-params";
import { OrderRepository } from "src/domain/store/application/repositories/order-repository";
import { ProductRepository } from "src/domain/store/application/repositories/product-repository";
import { OrderProduct } from "src/domain/store/enterprise/entities/order-product";
import { Product } from "src/domain/store/enterprise/entities/product";
import { InMemoryProductDataStoreRepository } from "./in-memory-product-data-store-repository";

export class InMemoryProductsRepository implements ProductRepository {
  constructor(
    public dataStore: InMemoryProductDataStoreRepository,
    private orderRepository: OrderRepository,
  ) {}

  async decrementStockQuantity(orderProducts: OrderProduct[]): Promise<void> {
    for (const productSold of orderProducts) {
      const title = productSold.title;
      const quantitySold = productSold.quantity;

      this.dataStore.items.map((item) => {
        if (item.title === title) {
          item.stockQuantity = item.stockQuantity - quantitySold;
        }
      });
    }
  }

  async create(data: Product): Promise<void> {
    this.dataStore.items.push(data);
  }

  async findMany({ page }: PaginationParams): Promise<Product[]> {
    const perPage = 10;

    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const products = this.dataStore.items.slice(startIndex, endIndex);

    return products;
  }

  async findById(id: string): Promise<Product | null> {
    const product = this.dataStore.items.find(
      (item) => item.id?.toString() === id,
    );

    if (!product) {
      return null;
    }

    return product;
  }

  async findByTitle(title: string): Promise<Product | null> {
    const titleLowerCase = title.toLowerCase();

    const product = this.dataStore.items.find(
      (item) => item.title.toLocaleLowerCase() === titleLowerCase,
    );

    if (!product) {
      return null;
    }

    return product;
  }

  async findManyByCategoryId(
    id: string,
    page: number,
  ): Promise<Product[] | null> {
    const products = this.dataStore.items
      .filter((item) => item.categoryId.toString() === id)
      .slice((page - 1) * 20, page * 20);

    if (!products) {
      return null;
    }

    return products;
  }

  async findByBuyerId(
    buyerId: string,
    page: number,
  ): Promise<Product[] | null> {
    const orders = await this.orderRepository.findByBuyerId(buyerId);

    if (!orders || orders.length === 0) return null;

    const productTitles = orders
      .filter((order) => order.buyerId.toString() === buyerId)
      .flatMap((order) => order.orderProducts)
      .map((orderProduct) => orderProduct.title);

    const products = productTitles
      .map((productTitle) =>
        this.dataStore.items.find((item) => item.title === productTitle),
      )
      .filter((product): product is Product => product !== undefined)
      .slice((page - 1) * 20, page * 20);

    if (products.length === 0) {
      return null;
    }

    return products;
  }

  async searchMany(query: string, page: number): Promise<Product[] | null> {
    const queryWords = query.toLocaleLowerCase().split(" ");

    const products = this.dataStore.items
      .filter((item) =>
        queryWords.some(
          (word) =>
            item.title.toLowerCase().includes(word) ||
            (item.categoryTitle &&
              item.categoryTitle.toLowerCase().includes(word)),
        ),
      )
      .slice((page - 1) * 20, page * 20);

    if (!products) {
      return null;
    }

    return products;
  }

  async update(data: Product): Promise<void> {
    const existingProduct = this.dataStore.items.find(
      (item) => item.id === data.id,
    );

    if (existingProduct) {
      Object.assign(existingProduct, data);
    } else {
      throw new Error("Produto não encontrado");
    }
  }

  async remove(id: string): Promise<void> {
    this.dataStore.items = this.dataStore.items.filter(
      (item) => item.id.toString() !== id,
    );
  }
}
