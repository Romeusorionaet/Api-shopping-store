import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import { env } from "src/infra/env";

config();
console.log("Node env:", env.NODE_ENV);

export const prisma = new PrismaClient();
