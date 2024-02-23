import { Slug } from "./value-objects/slug";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { Optional } from "src/core/@types/optional";
import dayjs from "dayjs";
import { Entity } from "src/core/entities/entity";

export type ModeOfSale = "SELLS_ONLY_IN_THE_REGION" | "ONLINE_STORE";

export interface ProductProps {
  categoryId: UniqueEntityID | string;
  categoryTitle: string;
  title: string;
  slug: Slug | string;
  description: string;
  price: number;
  imgUrlList: string[];
  stockQuantity: number;
  minimumQuantityStock: number;
  discountPercentage: number;
  width: number | null;
  height: number | null;
  weight: number | null;
  corsList: string[];
  placeOfSale?: ModeOfSale;
  star: number | null;
  createdAt: Date;
  updatedAt?: Date;
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

  get star() {
    return this.props.star;
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
    props: Optional<ProductProps, "createdAt" | "slug" | "placeOfSale">,
    id?: UniqueEntityID,
  ) {
    const product = new Product(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        createdAt: props.createdAt ?? new Date(),
        placeOfSale: props.placeOfSale ?? "ONLINE_STORE",
      },
      id,
    );

    return product;
  }
}
