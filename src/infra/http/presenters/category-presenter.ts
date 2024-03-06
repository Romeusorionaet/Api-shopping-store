import { Category } from "src/domain/store/enterprise/entities/category";

export class CategoryPresenter {
  static toHTTP(category: Category) {
    return {
      id: category.id.toString(),
      title: category.title,
      slug: category.slug.value,
      imgUrl: category.imgUrl,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}
