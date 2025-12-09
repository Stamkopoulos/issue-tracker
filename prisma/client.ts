import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  // Explicitly pass datasourceUrl to align with Prisma config requirements
  return new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
  });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

if (process.env.NODE_ENV !== "production")
  globalThis.prismaGlobal = prismaClientSingleton();

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;
