import "@fastify/jwt";

declare module "@fastify/jwt" {
  export interface FastifyJWT {
    user: {
      sub: string;
      // TODO publicId: string;
      //   role: "ADMIN" | "MEMBER";
    };
  }
}
