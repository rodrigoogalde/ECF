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
    // Fetch current response to accumulate values
    const currentResponse = await prisma.questionResponse.findUnique({
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
        }
      }
    });

    if (!currentResponse) {
      throw new Error(`QuestionResponse not found for attemptId: ${attemptId}, questionId: ${questionId}`);
    }

    // Build update data with accumulation for timeSpent and switchCount
    const updateData: {
      selectedOptionId?: number | null;
      timeSpent?: number;
      switchCount?: number;
      flagged?: boolean;
      isCorrect?: boolean | null;
    } = {};

    if (data.flagged !== undefined) {
      updateData.flagged = data.flagged;
    }

    if (data.timeSpent !== undefined) {
      updateData.timeSpent = currentResponse.timeSpent + data.timeSpent;
    }

    if (data.switchCount !== undefined) {
      updateData.switchCount = currentResponse.switchCount + data.switchCount;
    }

    if (data.selectedOptionId !== undefined) {
      updateData.selectedOptionId = data.selectedOptionId;

      // Increment switchCount when selectedOptionId changes
      if (data.selectedOptionId !== currentResponse.selectedOptionId) {
        updateData.switchCount = currentResponse.switchCount + 1;
      }

      // Calculate isCorrect when selectedOptionId is updated
      if (data.selectedOptionId === null) {
        updateData.isCorrect = null;
      } else {
        const selectedOption = currentResponse.question.options.find(
          (opt) => opt.id === data.selectedOptionId
        );
        updateData.isCorrect = selectedOption?.label === currentResponse.question.correctLabel;
      }
    }

    return await prisma.questionResponse.update({
      where: {
        attemptId_questionId: {
          attemptId,
          questionId
        }
      },
      data: updateData,
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
