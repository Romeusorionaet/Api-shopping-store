import { Product } from "src/domain/store/enterprise/entities/product";

export class InMemoryProductDataStoreRepository {
  public items: Product[] = [];
}
