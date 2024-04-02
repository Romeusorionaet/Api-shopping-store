import fastify from "fastify";
import { ZodError } from "zod";
import { env } from "./infra/env";
import JWT from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import { categoriesRoutes } from "./infra/http/controllers/category/routes";
import { productsRoutes } from "./infra/http/controllers/products/routes";
import CORS from "@fastify/cors";
import { buyerRoutes } from "./infra/http/controllers/buyer/routes";
import { orderRoutes } from "./infra/http/controllers/order/routes";
import { authRoutes } from "./infra/http/controllers/user/auth/routes";
import { userRoutes } from "./infra/http/controllers/user/routes";

export const app = fastify();

app.register(CORS, {
  origin: "*",
  credentials: true,
});

app.register(JWT, {
  secret: env.JWT_PRIVATE_KEY,
  cookie: {
    cookieName: "refreshToken",
    signed: false,
  },
});

app.register(fastifyCookie);

app.register(categoriesRoutes);
app.register(productsRoutes);
app.register(userRoutes);
app.register(buyerRoutes);
app.register(orderRoutes);
app.register(authRoutes);

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
