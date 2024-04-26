import { FastifyInstance } from "fastify";
import { webhook } from "./webhook";
import { configWebhook } from "./config-webhook";
// import { verifyAccessTokenEfiPay } from "../../middlewares/get-access-token-efi-pay";

export async function webhookRoutes(app: FastifyInstance) {
  app.post("/webhook", webhook);
  app.post("/webhook/config", configWebhook);
  // app.post("/webhook/pix", webhookPix);
}
