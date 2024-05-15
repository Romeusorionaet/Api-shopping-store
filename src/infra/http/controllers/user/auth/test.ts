import { FastifyReply, FastifyRequest } from "fastify";
import { env } from "src/infra/env";

export async function testRoute(request: FastifyRequest, reply: FastifyReply) {
  console.log("==teste");

  return reply
    .setCookie("@shopping-store/AT.2.0", "at", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      domain: env.DOMAIN_COOKIE_TOKEN,
    })
    .redirect(env.SHOPPING_STORE_URL_WEB);
}
