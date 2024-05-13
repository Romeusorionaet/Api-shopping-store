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
import { webhookRoutes } from "./infra/http/controllers/webhook/routes";
import rawBody from "fastify-raw-body";

export const app = fastify();

app.register(CORS, {
  origin: env.SHOPPING_STORE_URL_WEB,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
});

app.register(JWT, {
  secret: env.JWT_PRIVATE_KEY,
});

app.register(fastifyCookie, {
  secret: env.COOKIE_PRIVATE_KEY,
  parseOptions: {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    domain: env.DOMAIN_COOKIE_TOKEN,
    signed: false,
    path: "/",
  },
});

app.register(rawBody, {
  field: "rawBody",
  global: false,
  encoding: "utf8",
  runFirst: true,
  routes: [],
  jsonContentTypes: [],
});

app.register(categoriesRoutes);
app.register(productsRoutes);
app.register(userRoutes);
app.register(orderRoutes);
app.register(buyerRoutes);
app.register(authRoutes);
app.register(webhookRoutes);

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
