import { FastifyInstance } from "fastify";
import { webhook } from "./webhook";

export async function webhookRoutes(app: FastifyInstance) {
  app.post("/webhook", webhook);
}
