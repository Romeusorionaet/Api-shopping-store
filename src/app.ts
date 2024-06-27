import { categoriesRoutes } from "./infra/http/controllers/category/routes";
import { productsRoutes } from "./infra/http/controllers/products/routes";
import { webhookRoutes } from "./infra/http/controllers/webhook/routes";
import { authRoutes } from "./infra/http/controllers/user/auth/routes";
import { buyerRoutes } from "./infra/http/controllers/buyer/routes";
import { orderRoutes } from "./infra/http/controllers/order/routes";
import { userRoutes } from "./infra/http/controllers/user/routes";
import rawBody from "fastify-raw-body";
import fastifyJWT from "@fastify/jwt";
import { Server } from "socket.io";
import { env } from "./infra/env";
import CORS from "@fastify/cors";
import { ZodError } from "zod";
import fastify from "fastify";

export const app = fastify();

const serverHttp = app.server;

export const io = new Server(serverHttp, {
  cors: {
    origin: env.SHOPPING_STORE_URL_WEB,
  },
});

app.register(CORS, {
  origin: env.SHOPPING_STORE_URL_WEB,
  credentials: true,
  allowedHeaders: [
    "content-type",
    "Access-Control-Credentials",
    "Access-Control-Allow-Origin",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
});

app.register(fastifyJWT, {
  secret: env.JWT_PRIVATE_KEY,
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
  }

  return reply.status(500).send({ message: "Internal server error." });
});
