import { ProductRepository } from "src/domain/store/application/repositories/product-repository";
import { Product } from "src/domain/store/enterprise/entities/product";

export class InMemoryProductsRepository implements ProductRepository {
  public items: Product[] = [];

  async findById(id: string): Promise<Product | null> {
    const product = this.items.find((item) => item.id.toString() === id);

    if (!product) {
      return null;
    }

    return product;
  }

  async searchMany(query: string, page: number): Promise<Product[]> {
    const queryWords = query.toLocaleLowerCase().split(" ");

    return this.items
      .filter((item) =>
        queryWords.some(
          (word) =>
            item.title.toLowerCase().includes(word) ||
            (item.categoryTitle &&
              item.categoryTitle.toLowerCase().includes(word)),
        ),
      )
      .slice((page - 1) * 20, page * 20);
  }

  async create(product: Product): Promise<void> {
    this.items.push(product);
  }
}
