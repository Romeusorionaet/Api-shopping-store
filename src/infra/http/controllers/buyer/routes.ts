import { FastifyInstance } from "fastify";
import { profile } from "./profile";
import { getBuyerAddress } from "./get-buyer-address";
import { verifyJWTAccessToken } from "../../middlewares/verify-jwt-access-token";
import { getBuyerOrderProduct } from "./get-buyer-order-product";
import { fetchBuyerOrders } from "./fetch-buyer-orders";
import { fetchBuyerNotifications } from "./fetch-buyer-notifications";
import { readBuyerNotification } from "./read-buyer-notification";

export async function buyerRoutes(app: FastifyInstance) {
  app.register(async (subApp) => {
    subApp.addHook("preHandler", verifyJWTAccessToken(["read"]));
    subApp.get("/buyer/profile", profile);
    subApp.get("/buyer/address", getBuyerAddress);
    subApp.get("/buyer/orders", fetchBuyerOrders);
    subApp.get("/buyer/order/products", getBuyerOrderProduct);
    subApp.get("/buyer/notifications", fetchBuyerNotifications);
    subApp.get(
      "/buyer/read/notification/:notificationId",
      readBuyerNotification,
    );
  });
}
