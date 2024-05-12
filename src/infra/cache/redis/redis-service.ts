import { Redis } from "ioredis";
import { env } from "src/infra/env";

export class RedisService extends Redis {
  constructor() {
    if (env.NODE_ENV === "production") {
      super(
        `rediss://default:${env.UPSTASH_REDIS_PASSWORD}@${env.UPSTASH_REDIS_URL}`,
      );
    } else {
      super({ host: env.REDIS_HOST, port: env.REDIS_PORT, db: env.REDIS_DB });
    }
  }
}
