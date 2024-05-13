import { FastifyReply, FastifyRequest } from "fastify";

export async function verifyJWTRefreshToken(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const result = await request.jwtVerify();
    console.log(result, "===mdrt");
  } catch (err) {
    return reply.status(401).send({ message: "Unauthorized." });
  }
}
