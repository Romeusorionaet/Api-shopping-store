import { ProductRepository } from "src/domain/store/application/repositories/product-repository";
import { Product } from "src/domain/store/enterprise/entities/product";

export class InMemoryProductRepository implements ProductRepository {
  public items: Product[] = [];

  async searchMany(query: string, page: number): Promise<Product[]> {
    const queryWords = query.toLocaleLowerCase().split(" ");

    return this.items
      .filter((item) =>
        queryWords.every((word) =>
          item.title.toLocaleLowerCase().includes(word),
        ),
      )
      .slice((page - 1) * 20, page * 20);
  }

  async create(product: Product): Promise<void> {
    this.items.push(product);
  }
}
