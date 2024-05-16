import { FastifyReply, FastifyRequest } from "fastify";
import { env } from "src/infra/env";

export async function testRoute(request: FastifyRequest, reply: FastifyReply) {
  console.log("==test==env", env.SHOPPING_STORE_URL_WEB);

  return reply
    .status(201)
    .setCookie("@shopping-store/AT.2.0", "at", {
      maxAge: 10000,
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    })
    .redirect(env.SHOPPING_STORE_URL_WEB);
}
