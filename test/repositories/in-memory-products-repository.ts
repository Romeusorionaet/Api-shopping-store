/* eslint-disable array-callback-return */
import { PaginationParams } from "src/core/repositories/pagination-params";
import { OrderRepository } from "src/domain/store/application/repositories/order-repository";
import { ProductRepository } from "src/domain/store/application/repositories/product-repository";
import { TechnicalProductNotFoundError } from "src/domain/store/application/use-cases/errors/technical-product-details-not-found-error";
import { OrderProduct } from "src/domain/store/enterprise/entities/order-product";
import { Product } from "src/domain/store/enterprise/entities/product";
import { TechnicalProductDetails } from "src/domain/store/enterprise/entities/technical-product-details";

export class InMemoryProductsRepository implements ProductRepository {
  public items: Product[] = [];
  public itemsDetails: TechnicalProductDetails[] = [];

  constructor(private orderRepository: OrderRepository) {}

  async addStarToProduct(id: string): Promise<void> {
    const product = this.items.find((item) => item.id.toString() === id);

    if (product && product.stars) {
      product.stars += 1;
    }
  }

  async decrementStockQuantity(orderProducts: OrderProduct[]): Promise<void> {
    for (const productSold of orderProducts) {
      const title = productSold.title;
      const quantitySold = productSold.quantity;

      this.items.map((item) => {
        if (item.title === title) {
          item.stockQuantity = item.stockQuantity - quantitySold;
        }
      });
    }
  }

  async create(data: Product): Promise<void> {
    this.items.push(data);
  }

  async createTechnicalProductDetails(
    data: TechnicalProductDetails,
  ): Promise<void> {
    this.itemsDetails.push(data);
  }

  async findMany({ page }: PaginationParams): Promise<Product[]> {
    const perPage = 10;

    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const products = this.items.slice(startIndex, endIndex);

    return products;
  }

  async findById(id: string): Promise<Product | null> {
    const product = this.items.find((item) => item.id?.toString() === id);

    if (!product) {
      return null;
    }

    return product;
  }

  async findByTitle(title: string): Promise<Product | null> {
    const titleLowerCase = title.toLowerCase();

    const product = this.items.find(
      (item) => item.title.toLocaleLowerCase() === titleLowerCase,
    );

    if (!product) {
      return null;
    }

    return product;
  }

  async findTechnicalProductDetailsByProductId(
    id: string,
  ): Promise<TechnicalProductDetails | null> {
    const existingTechnicalProductDetails = this.itemsDetails.find(
      (item) => item.productId.toString() === id,
    );

    if (!existingTechnicalProductDetails) {
      return null;
    }

    return existingTechnicalProductDetails;
  }

  async findManyByCategoryId(
    id: string,
    page: number,
  ): Promise<Product[] | null> {
    const products = this.items
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
        this.items.find((item) => item.title === productTitle),
      )
      .filter((product): product is Product => product !== undefined)
      .slice((page - 1) * 20, page * 20);

    if (products.length === 0) {
      return null;
    }

    return products;
  }

  async updateTechnicalProductDetails(
    data: TechnicalProductDetails,
  ): Promise<void> {
    const existingTechnicalProductDetails = this.itemsDetails.find(
      (item) => item.id === data.id,
    );

    if (existingTechnicalProductDetails) {
      Object.assign(existingTechnicalProductDetails, data);
    } else {
      throw new TechnicalProductNotFoundError();
    }
  }

  async findTechnicalProductDetails(
    id: string,
  ): Promise<TechnicalProductDetails | null> {
    const technicalProductDetails = this.itemsDetails.find(
      (item) => item.id?.toString() === id,
    );

    if (!technicalProductDetails) {
      return null;
    }

    return technicalProductDetails;
  }

  async findManyByDiscountPercentage(page: number): Promise<Product[] | null> {
    const products = this.items
      .filter((item) => item.discountPercentage > 0)
      .slice((page - 1) * 20, page * 20);

    if (!products) {
      return null;
    }

    return products;
  }

  async findManyByStars(page: number): Promise<Product[] | null> {
    const products = this.items
      .filter((item) => item.stars! > 0)
      .slice((page - 1) * 20, page * 20);

    if (!products) {
      return null;
    }

    return products;
  }

  async searchMany(query: string, page: number): Promise<Product[] | null> {
    const queryWords = query.toLocaleLowerCase().split(" ");

    const products = this.items
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
    const existingProduct = this.items.find((item) => item.id === data.id);

    if (existingProduct) {
      Object.assign(existingProduct, data);
    } else {
      throw new Error("Produto não encontrado");
    }
  }
}
