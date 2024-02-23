import { ProductRepository } from "src/domain/store/application/repositories/product-repository";
import {
  Product,
  ProductProps,
} from "src/domain/store/enterprise/entities/product";

interface ProductPropsWithId extends ProductProps {
  id: string;
}

export class InMemoryProductsRepository implements ProductRepository {
  public items: ProductPropsWithId[] = [];

  async create(data: Product): Promise<void> {
    const product = {
      id: data.id.toString(),
      categoryId: data.categoryId.toString(),
      categoryTitle: data.categoryTitle,
      title: data.title,
      slug: data.slug.toString(),
      description: data.description,
      price: data.price,
      imgUrlList: data.imgUrlList,
      stockQuantity: data.stockQuantity,
      minimumQuantityStock: data.minimumQuantityStock,
      discountPercentage: data.discountPercentage,
      width: data.width,
      height: data.height,
      weight: data.weight,
      corsList: data.corsList,
      placeOfSale: data.placeOfSale,
      star: data.star,
      updatedAt: new Date(),
      createdAt: new Date(),
    };

    this.items.push(product);
  }

  async findById(id: string): Promise<ProductProps | null> {
    const product = this.items.find((item) => item.id?.toString() === id);

    if (!product) {
      return null;
    }

    return product;
  }

  async searchMany(query: string, page: number): Promise<ProductProps[]> {
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
}
