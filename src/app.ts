import fastify from "fastify";
import { ZodError } from "zod";
import { env } from "./infra/env";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import { categoriesRoutes } from "./infra/http/controllers/categories/routes";
import { productsRoutes } from "./infra/http/controllers/products/routes";

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_PRIVATE_KEY,
  cookie: {
    cookieName: "refreshToken",
    signed: false,
  },
  sign: {
    expiresIn: "10m",
  },
});

app.register(fastifyCookie);

app.register(categoriesRoutes);
app.register(productsRoutes);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: "Validation error.", issues: error.format() });
  }

  if (env.NODE_ENV !== "production") {
    console.error(error);
  } else {
    console.error(error.message);
    // TODO Here we should log to on external tool
  }

  return reply.status(500).send({ message: "Internal server error." });
});
