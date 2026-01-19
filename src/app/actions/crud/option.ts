import { Option, Prisma } from "@prisma/client";
import { BaseCRUD, QueryOptions } from "./base";
import { prisma } from "@/lib/prisma";

class OptionCRUD extends BaseCRUD<Option, Prisma.OptionCreateInput, Prisma.OptionUpdateInput> {
  constructor() {
    super('Option', prisma.option);
  }

  async getAll(whereConditions?: Prisma.OptionWhereInput, options?: QueryOptions): Promise<Option[]> {
    return await super.getAll(
      whereConditions,
      {
        ...options,
        include: {
          question: true,
          ...options?.include
        }
      }
    );
  }

  async getOne(whereConditions: Prisma.OptionWhereInput, options?: Omit<QueryOptions, 'skip' | 'take'>): Promise<Option> {
    return await super.getOne(
      whereConditions,
      {
        ...options,
        include: {
          question: true,
          ...options?.include
        }
      }
    );
  }
}

export const optionCRUD = new OptionCRUD();
