import { Slug } from "./value-objects/slug";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { Optional } from "src/core/@types/optional";
import dayjs from "dayjs";
import { Entity } from "src/core/entities/entity";
import { ModeOfSale } from "src/core/entities/mode-of-sale";

export interface ProductProps {
  categoryId: UniqueEntityID;
  categoryTitle: string;
  title: string;
  slug: Slug;
  description: string;
  price: number;
  imgUrlList: string[];
  corsList: string[];
  stockQuantity: number;
  minimumQuantityStock: number;
  discountPercentage: number;
  width: number;
  height: number;
  weight: number;
  placeOfSale?: ModeOfSale;
  stars?: number | null;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Product extends Entity<ProductProps> {
  get categoryId() {
    return this.props.categoryId;
  }

  get categoryTitle() {
    return this.props.categoryTitle;
  }

  get title() {
    return this.props.title;
  }

  get slug() {
    return this.props.slug;
  }

  get description() {
    return this.props.description;
  }

  get price() {
    return this.props.price;
  }

  get imgUrlList() {
    return this.props.imgUrlList;
  }

  get stockQuantity() {
    return this.props.stockQuantity;
  }

  get minimumQuantityStock() {
    return this.props.minimumQuantityStock;
  }

  get discountPercentage() {
    return this.props.discountPercentage;
  }

  get width() {
    return this.props.width;
  }

  get height() {
    return this.props.height;
  }

  get weight() {
    return this.props.weight;
  }

  get corsList() {
    return this.props.corsList;
  }

  get placeOfSale() {
    return this.props.placeOfSale;
  }

  get stars() {
    return this.props.stars;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get isNew(): boolean {
    return dayjs().diff(this.createdAt, "days") <= 3;
  }

  get excerpt() {
    return this.description.substring(0, 120).trimEnd().concat("...");
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  set title(title: string) {
    this.props.title = title;
    this.props.slug = Slug.createFromText(title);

    this.touch();
  }

  static create(
    props: Optional<ProductProps, "createdAt" | "slug">,
    id?: UniqueEntityID,
  ) {
    const product = new Product(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
    return product;
  }

  update(props: Partial<ProductProps>): Product {
    return new Product(
      {
        ...this.props,
        ...props,
        updatedAt: new Date(),
      },
      this.id,
    );
  }
}
