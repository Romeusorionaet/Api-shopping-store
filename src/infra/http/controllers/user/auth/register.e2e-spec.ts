import request from "supertest";
import { app } from "src/infra/app";

describe("Register User (E2E)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[POST] auth/user/register", async () => {
    const response = await request(app.server)
      .post("/auth/user/register")
      .send({
        username: "User test 01",
        email: "usertest01@gmail.com",
        password: "123456",
        picture: "http://faker_picture.com",
      });

    expect(response.statusCode).toEqual(201);
  });

  test("[POST] should not be able to register a user twice with the same e-mail", async () => {
    await request(app.server).post("/auth/user/register").send({
      username: "User test 01",
      email: "usertest01@gmail.com",
      password: "123456",
      picture: "http://faker_picture.com",
    });

    const response = await request(app.server)
      .post("/auth/user/register")
      .send({
        username: "User test 01",
        email: "usertest01@gmail.com",
        password: "123456",
        picture: "http://faker_picture.com",
      });

    expect(response.statusCode).toEqual(400);
  });
});
