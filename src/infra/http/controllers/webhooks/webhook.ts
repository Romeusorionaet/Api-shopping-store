import { FastifyRequest, FastifyReply } from "fastify";

export async function webhook(request: FastifyRequest, reply: FastifyReply) {
  console.log(request.headers);
  console.log("===", request.user, "===");

  reply.status(200).send();
}
