import { FastifyReply, FastifyRequest } from "fastify";
import { env } from "src/infra/env";

export async function testRoute(request: FastifyRequest, reply: FastifyReply) {
  console.log(
    "==test==env",
    env.DOMAIN_COOKIE_TOKEN,
    env.SHOPPING_STORE_URL_WEB,
  );

  return reply
    .status(200)
    .setCookie("@shopping-store/AT.2.0", "at", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      domain: env.DOMAIN_COOKIE_TOKEN,
    })
    .redirect(env.SHOPPING_STORE_URL_WEB)
    .status(200);
}
