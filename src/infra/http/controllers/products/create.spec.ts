import { test, describe, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "src/app";

describe("Create Product (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test("should be able to create a product", async () => {
    const responseCategory = await request(app.server).post("/category").send({
      title: "category test title 01",
      imgUrl: "http://teste.com.br",
    });

    const category = responseCategory.body;

    const response = await request(app.server)
      .post("/product")
      .send({
        categoryId: category._id.value,
        categoryTitle: category.props.title,
        title: "Aetestineo demonstro est crastinus debitis arguo velit vinculu",
        description:
          "Cauda advoco coruscus tristis talus abduco centum adnuo aiunt.\n" +
          "Ullam urbanus conspergo amaritudo aureus deleniti amor ascit natus canto.",
        price: 5368576,
        imgUrlList: ["img1", "img2", "img3", "img4"],
        stockQuantity: 84600,
        minimumQuantityStock: 43696,
        discountPercentage: 41178,
        width: 656484,
        height: 3966472,
        weight: 1362780,
        corsList: ["color1", "color2", "color3", "color4"],
        placeOfSale: "ONLINE_STORE",
        stars: 0,
      });

    expect(response.statusCode).toEqual(201);
  });

  test("should not be able to create a product twice with the same title", async () => {
    const responseCategory = await request(app.server).post("/category").send({
      title: "category test title for product 03",
      imgUrl: "http://teste.com.br",
    });

    const category = responseCategory.body;

    await request(app.server)
      .post("/product")
      .send({
        categoryId: category._id.value,
        categoryTitle: category.props.title,
        title: "Aetestineo demonstro est crastinus debitis arguo velit vinculu",
        description:
          "Cauda advoco coruscus tristis talus abduco centum adnuo aiunt.\n" +
          "Ullam urbanus conspergo amaritudo aureus deleniti amor ascit natus canto.",
        price: 5368576,
        imgUrlList: ["img1", "img2", "img3", "img4"],
        stockQuantity: 84600,
        minimumQuantityStock: 43696,
        discountPercentage: 41178,
        width: 656484,
        height: 3966472,
        weight: 1362780,
        corsList: ["color1", "color2", "color3", "color4"],
        placeOfSale: "ONLINE_STORE",
        stars: 0,
      });

    const response = await request(app.server)
      .post("/product")
      .send({
        categoryId: category._id.value,
        categoryTitle: category.props.title,
        title: "Aetestineo demonstro est crastinus debitis arguo velit vinculu",
        description:
          "Cauda advoco coruscus tristis talus abduco centum adnuo aiunt.\n" +
          "Ullam urbanus conspergo amaritudo aureus deleniti amor ascit natus canto.",
        price: 5368576,
        imgUrlList: ["img1", "img2", "img3", "img4"],
        stockQuantity: 84600,
        minimumQuantityStock: 43696,
        discountPercentage: 41178,
        width: 656484,
        height: 3966472,
        weight: 1362780,
        corsList: ["color1", "color2", "color3", "color4"],
        placeOfSale: "ONLINE_STORE",
        stars: 0,
      });

    expect(response.statusCode).toEqual(400);
  });
});
