import { PrismaClient } from "@prisma/client";

let prismaInstance;

const prisma = new Proxy({}, {
  get(target, prop) {
    if (!prismaInstance) {
      if (process.env.NODE_ENV === "production") {
        prismaInstance = new PrismaClient();
      } else {
        if (!global.prisma) {
          global.prisma = new PrismaClient();
        }
        prismaInstance = global.prisma;
      }
    }
    return Reflect.get(prismaInstance, prop);
  }
});

export default prisma;
