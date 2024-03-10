import request from "supertest";
import { app } from "src/app";

describe("Register User (E2E)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test("should be able to register a new user", async () => {
    const response = await request(app.server).post("/user/register").send({
      username: "User test 01",
      email: "usertest01@gmail.com",
      password: "123456",
    });

    expect(response.statusCode).toEqual(201);
  });

  test("should not be able to register a user twice with the same e-mail", async () => {
    await request(app.server).post("/user/register").send({
      username: "User test 01",
      email: "usertest01@gmail.com",
      password: "123456",
    });

    const response = await request(app.server).post("/user/register").send({
      username: "User test 01",
      email: "usertest01@gmail.com",
      password: "123456",
    });

    expect(response.statusCode).toEqual(400);
  });
});
