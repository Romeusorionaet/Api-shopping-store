import { FastifyInstance } from "fastify";
import { profile } from "./profile";
import { getBuyerAddress } from "./get-buyer-address";
import { verifyJWTAccessToken } from "../../middlewares/verify-jwt-access-token";
import { getBuyerOrderProduct } from "./get-buyer-order-product";
import { fetchBuyerOrders } from "./fetch-buyer-orders";
import { fetchBuyerNotifications } from "./fetch-buyer-notifications";
import { readBuyerNotification } from "./read-buyer-notification";

export async function buyerRoutes(app: FastifyInstance) {
  // app.addHook("onRequest", verifyJWTAccessToken);

  app.get(
    "/buyer/profile",
    {
      preHandler: verifyJWTAccessToken(["read"]),
    },
    profile,
  );
  app.get(
    "/buyer/address",
    {
      preHandler: verifyJWTAccessToken(["read"]),
    },
    getBuyerAddress,
  );
  app.get(
    "/buyer/orders",
    {
      preHandler: verifyJWTAccessToken(["read"]),
    },
    fetchBuyerOrders,
  );
  app.get(
    "/buyer/order/products",
    {
      preHandler: verifyJWTAccessToken(["read"]),
    },
    getBuyerOrderProduct,
  );
  app.get(
    "/buyer/notifications",
    {
      preHandler: verifyJWTAccessToken(["read"]),
    },
    fetchBuyerNotifications,
  );
  app.get(
    "/buyer/read/notification/:notificationId",
    {
      preHandler: verifyJWTAccessToken(["read"]),
    },
    readBuyerNotification,
  );
}
