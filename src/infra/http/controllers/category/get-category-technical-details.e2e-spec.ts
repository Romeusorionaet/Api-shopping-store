import { CreateAndAuthenticateUserAdminWithTokensFactory } from "test/factories/make-create-and-authenticate-user";
import { ActivityRecordFactory } from "test/factories/make-activity-record";
import { ActivityStatus } from "src/core/entities/activity-status";
import { CategoryFactory } from "test/factories/make-category";
import { EntityType } from "src/core/entities/entity-type";
import { app } from "src/infra/app";
import request from "supertest";
import { ProductFactory } from "test/factories/make-product";

describe("Get category technical details (E2E)", () => {
  let createAndAuthenticateUserAdminWithTokensFactory: CreateAndAuthenticateUserAdminWithTokensFactory;
  let categoryFactory: CategoryFactory;
  let activityRecordFactory: ActivityRecordFactory;
  let productFactory: ProductFactory;

  beforeAll(async () => {
    await app.ready();

    categoryFactory = new CategoryFactory();
    activityRecordFactory = new ActivityRecordFactory();
    productFactory = new ProductFactory();

    createAndAuthenticateUserAdminWithTokensFactory =
      new CreateAndAuthenticateUserAdminWithTokensFactory();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[GET] /category/technical-details/:categoryId", async () => {
    const { accessToken, staffId, user } =
      await createAndAuthenticateUserAdminWithTokensFactory.makePrismaCreateAndAuthenticateUserAdminWithTokens(
        app,
      );

    const category = await categoryFactory.makePrismaCategory();
    const activityRecord = await activityRecordFactory.makePrismaActivityRecord(
      {
        entityId: category.id,
        entityType: EntityType.CATEGORY,
        status: ActivityStatus.CREATED,
        staffId,
      },
    );
    await productFactory.makePrismaProduct({
      categoryId: category.id,
      categoryTitle: category.title,
    });

    const response = await request(app.server)
      .get(`/category/technical-details/${category.id}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.categoryTechnicalDetails).toHaveLength(1);
    expect(response.body).toEqual(
      expect.objectContaining({
        productQuantityPerCategory: 1,
        categoryBasicInformation: expect.objectContaining({
          id: category.id.toString(),
          title: category.title,
          slug: category.slug.value,
          imgUrl: category.imgUrl,
        }),
        categoryTechnicalDetails: expect.arrayContaining([
          expect.objectContaining({
            id: activityRecord.id.toString(),
            staff: expect.objectContaining({
              user: expect.objectContaining({
                name: user.username,
                email: user.email,
              }),
            }),
          }),
        ]),
      }),
    );
  });
});
