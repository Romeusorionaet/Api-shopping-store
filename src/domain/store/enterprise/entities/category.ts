import { Entity } from "src/core/entities/entity";
import { Slug } from "./value-objects/slug";
import dayjs from "dayjs";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { Optional } from "src/core/@types/optional";

export interface CategoryProps {
  title: string;
  slug: Slug;
  imgUrl: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Category extends Entity<CategoryProps> {
  get title() {
    return this.props.title;
  }

  get slug() {
    return this.props.slug;
  }

  get imgUrl() {
    return this.props.imgUrl;
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

  private touch() {
    this.props.updatedAt = new Date();
  }

  set title(title: string) {
    this.props.title = title;
    this.props.slug = Slug.createFromText(title);

    this.touch();
  }

  set imgUrl(imgUrl: string) {
    this.props.imgUrl = imgUrl;

    this.touch();
  }

  static create(
    props: Optional<CategoryProps, "createdAt" | "slug">,
    id?: UniqueEntityID,
  ) {
    const product = new Category(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return product;
  }

  update(props: Partial<CategoryProps>): Category {
    return new Category(
      {
        ...this.props,
        ...props,
        updatedAt: new Date(),
      },
      this.id,
    );
  }
}
