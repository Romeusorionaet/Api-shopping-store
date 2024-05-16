import { FastifyReply, FastifyRequest } from "fastify";
import { env } from "src/infra/env";

export async function testRoute(request: FastifyRequest, reply: FastifyReply) {
  console.log("==test==env", env.SHOPPING_STORE_URL_WEB);

  return reply
    .setCookie("@shopping-store/AT.2.0", "at", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    })
    .redirect(env.SHOPPING_STORE_URL_WEB);
}
