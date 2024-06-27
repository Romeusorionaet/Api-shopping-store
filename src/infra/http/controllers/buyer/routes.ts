import { FastifyInstance } from "fastify";
import { profile } from "./profile";
import { getBuyerAddress } from "./get-buyer-address";
import { verifyJWTAccessToken } from "../../middlewares/verify-jwt-access-token";
import { getBuyerOrderProduct } from "./get-buyer-order-product";
import { fetchBuyerOrders } from "./fetch-buyer-orders";
import { fetchBuyerNotifications } from "./fetch-buyer-notifications";
import { readBuyerNotification } from "./read-buyer-notification";

export async function buyerRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWTAccessToken);

  app.get("/buyer/profile", profile);
  app.get("/buyer/address", getBuyerAddress);
  app.get("/buyer/orders", fetchBuyerOrders);
  app.get("/buyer/order/products", getBuyerOrderProduct);
  app.get("/buyer/notifications", fetchBuyerNotifications);
  app.get("/buyer/read/notification/:notificationId", readBuyerNotification);
}
