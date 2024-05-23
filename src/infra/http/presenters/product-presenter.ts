import { Product } from "src/domain/store/enterprise/entities/product";

export class ProductPresenter {
  static toHTTP(product: Product) {
    return {
      id: product.id.toString(),
      categoryId: product.categoryId.toString(),
      categoryTitle: product.categoryTitle,
      title: product.title,
      slug: product.slug.value,
      description: product.description,
      price: product.price,
      imgUrlList: product.imgUrlList,
      corsList: product.corsList,
      stockQuantity: product.stockQuantity,
      minimumQuantityStock: product.minimumQuantityStock,
      discountPercentage: product.discountPercentage,
      width: product.width,
      height: product.height,
      weight: product.weight,
      placeOfSale: product.placeOfSale,
      stars: product.stars,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
