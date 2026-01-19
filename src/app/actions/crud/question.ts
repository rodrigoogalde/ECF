import { Question, Prisma } from "@prisma/client";
import { BaseCRUD, QueryOptions } from "./base";
import { prisma } from "@/lib/prisma";

class QuestionCRUD extends BaseCRUD<Question, Prisma.QuestionCreateInput, Prisma.QuestionUpdateInput> {
  constructor() {
    super('Question', prisma.question);
  }

  async getAll(whereConditions?: Prisma.QuestionWhereInput, options?: QueryOptions): Promise<Question[]> {
    return await super.getAll(
      whereConditions,
      {
        ...options,
        include: {
          options: true,
          course: true,
          ...options?.include
        }
      }
    );
  }

  async getOne(whereConditions: Prisma.QuestionWhereInput, options?: Omit<QueryOptions, 'skip' | 'take'>): Promise<Question> {
    return await super.getOne(
      whereConditions,
      {
        ...options,
        include: {
          options: true,
          course: true,
          ...options?.include
        }
      }
    );
  }
}

export const questionCRUD = new QuestionCRUD();
