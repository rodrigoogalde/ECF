import { QuestionResponse, Prisma } from "@prisma/client";
import { BaseCRUD, QueryOptions } from "./base";
import { prisma } from "@/lib/prisma";

class QuestionResponseCRUD extends BaseCRUD<QuestionResponse, Prisma.QuestionResponseCreateInput, Prisma.QuestionResponseUpdateInput> {
  constructor() {
    super('QuestionResponse', prisma.questionResponse);
  }

  async getAll(whereConditions?: Prisma.QuestionResponseWhereInput, options?: QueryOptions): Promise<QuestionResponse[]> {
    return await super.getAll(
      whereConditions,
      {
        ...options,
        include: {
          question: {
            include: {
              options: { where: { deleted: false } }
            }
          },
          selectedOption: true,
          attempt: true,
          ...options?.include
        }
      }
    );
  }

  async getOne(whereConditions: Prisma.QuestionResponseWhereInput, options?: Omit<QueryOptions, 'skip' | 'take'>): Promise<QuestionResponse> {
    return await super.getOne(
      whereConditions,
      {
        ...options,
        include: {
          question: {
            include: {
              options: { where: { deleted: false } }
            }
          },
          selectedOption: true,
          attempt: true,
          ...options?.include
        }
      }
    );
  }

  async updateResponse(
    attemptId: string,
    questionId: string,
    data: {
      selectedOptionId?: number | null;
      timeSpent?: number;
      switchCount?: number;
      flagged?: boolean;
    }
  ) {
    return await prisma.questionResponse.update({
      where: {
        attemptId_questionId: {
          attemptId,
          questionId
        }
      },
      data,
      include: {
        question: {
          include: {
            options: { where: { deleted: false } }
          }
        },
        selectedOption: true
      }
    });
  }

  async getResponseByAttemptAndQuestion(attemptId: string, questionId: string) {
    return await prisma.questionResponse.findUnique({
      where: {
        attemptId_questionId: {
          attemptId,
          questionId
        }
      },
      include: {
        question: {
          include: {
            options: { where: { deleted: false } }
          }
        },
        selectedOption: true
      }
    });
  }

  async getAttemptResponses(attemptId: string) {
    return await prisma.questionResponse.findMany({
      where: { attemptId },
      include: {
        question: {
          include: {
            options: { where: { deleted: false } },
            course: true
          }
        },
        selectedOption: true
      }
    });
  }
}

export const questionResponseCRUD = new QuestionResponseCRUD();
