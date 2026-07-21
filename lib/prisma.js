import { PrismaClient } from "@prisma/client";

let prismaInstance;

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL || process.env.MONGODB_URI;
  if (connectionString) {
    return new PrismaClient({
      datasources: {
        db: {
          url: connectionString,
        },
      },
    });
  }
  return new PrismaClient();
}

const prisma = new Proxy({}, {
  get(target, prop) {
    if (!prismaInstance) {
      if (process.env.NODE_ENV === "production") {
        prismaInstance = createPrismaClient();
      } else {
        if (!global.prisma) {
          global.prisma = createPrismaClient();
        }
        prismaInstance = global.prisma;
      }
    }
    return Reflect.get(prismaInstance, prop);
  }
});

export default prisma;
