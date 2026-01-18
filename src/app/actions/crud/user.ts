import { BaseCRUD } from "./base";
import { prisma } from "@/lib/prisma";
import { User, Prisma } from "@prisma/client";

class UserCRUD extends BaseCRUD<User, Prisma.UserCreateInput, Prisma.UserUpdateInput> {
  constructor() {
    super('User', prisma.user);
  }
}

export const userCRUD = new UserCRUD();