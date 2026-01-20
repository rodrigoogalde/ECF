import { Test, Prisma } from "@prisma/client";
import { BaseCRUD, QueryOptions } from "./base";
import { prisma } from "@/lib/prisma";

class TestCRUD extends BaseCRUD<Test, Prisma.TestCreateInput, Prisma.TestUpdateInput> {
  constructor() {
    super('Test', prisma.test);
  }

  async getAll(whereConditions?: Prisma.TestWhereInput, options?: QueryOptions): Promise<Test[]> {
    return await super.getAll(
      whereConditions,
      {
        ...options,
        include: {
          questions: {
            where: { deleted: false },
            include: {
              options: { where: { deleted: false } },
              course: true
            }
          },
          _count: {
            select: { questions: true, attempts: true }
          },
          ...options?.include
        }
      }
    );
  }

  async getOne(whereConditions: Prisma.TestWhereInput, options?: Omit<QueryOptions, 'skip' | 'take'>): Promise<Test> {
    return await super.getOne(
      whereConditions,
      {
        ...options,
        include: {
          questions: {
            where: { deleted: false },
            include: {
              options: { where: { deleted: false } },
              course: true
            }
          },
          _count: {
            select: { questions: true, attempts: true }
          },
          ...options?.include
        }
      }
    );
  }

  async getTestWithQuestions(testId: string) {
    return await prisma.test.findUnique({
      where: { id: testId },
      include: {
        questions: {
          where: { deleted: false },
          orderBy: { title: 'asc' },
          include: {
            options: { where: { deleted: false } },
            course: true
          }
        }
      }
    });
  }

  async createTestWithQuestions(name: string, questionIds: string[]) {
    return await prisma.test.create({
      data: {
        name,
        questions: {
          connect: questionIds.map(id => ({ id }))
        }
      },
      include: {
        questions: {
          include: {
            options: true,
            course: true
          }
        }
      }
    });
  }

  async addQuestionsToTest(testId: string, questionIds: string[]) {
    return await prisma.test.update({
      where: { id: testId },
      data: {
        questions: {
          connect: questionIds.map(id => ({ id }))
        }
      },
      include: {
        questions: {
          include: {
            options: true,
            course: true
          }
        }
      }
    });
  }

  async removeQuestionsFromTest(testId: string, questionIds: string[]) {
    return await prisma.test.update({
      where: { id: testId },
      data: {
        questions: {
          disconnect: questionIds.map(id => ({ id }))
        }
      },
      include: {
        questions: {
          include: {
            options: true,
            course: true
          }
        }
      }
    });
  }
}

export const testCRUD = new TestCRUD();
