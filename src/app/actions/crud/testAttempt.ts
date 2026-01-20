import { TestAttempt, Prisma } from "@prisma/client";
import { BaseCRUD, QueryOptions } from "./base";
import { prisma } from "@/lib/prisma";

class TestAttemptCRUD extends BaseCRUD<TestAttempt, Prisma.TestAttemptCreateInput, Prisma.TestAttemptUpdateInput> {
  constructor() {
    super('TestAttempt', prisma.testAttempt);
  }

  async getAll(whereConditions?: Prisma.TestAttemptWhereInput, options?: QueryOptions): Promise<TestAttempt[]> {
    return await super.getAll(
      whereConditions,
      {
        ...options,
        include: {
          test: {
            include: {
              questions: {
                where: { deleted: false },
                include: {
                  options: { where: { deleted: false } }
                }
              }
            }
          },
          responses: {
            include: {
              question: true,
              selectedOption: true
            }
          },
          user: {
            select: { id: true, name: true, email: true }
          },
          ...options?.include
        }
      }
    );
  }

  async getOne(whereConditions: Prisma.TestAttemptWhereInput, options?: Omit<QueryOptions, 'skip' | 'take'>): Promise<TestAttempt> {
    return await super.getOne(
      whereConditions,
      {
        ...options,
        include: {
          test: {
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
          },
          responses: {
            include: {
              question: true,
              selectedOption: true
            }
          },
          user: {
            select: { id: true, name: true, email: true }
          },
          ...options?.include
        }
      }
    );
  }

  async startAttempt(userId: string, testId: string) {
    const test = await prisma.test.findUnique({
      where: { id: testId },
      include: {
        questions: {
          where: { deleted: false },
          orderBy: { title: 'asc' },
          include: {
            options: { where: { deleted: false } }
          }
        }
      }
    });

    if (!test) {
      throw new Error('Test not found');
    }

    const attempt = await prisma.testAttempt.create({
      data: {
        userId,
        testId,
        status: 'IN_PROGRESS',
        responses: {
          create: test.questions.map(question => ({
            questionId: question.id,
            isCorrect: null,
            timeSpent: 0,
            switchCount: 0,
            flagged: false
          }))
        }
      },
      include: {
        test: {
          include: {
            questions: {
              where: { deleted: false },
              include: {
                options: { where: { deleted: false } },
                course: true
              }
            }
          }
        },
        responses: {
          include: {
            question: {
              include: {
                options: { where: { deleted: false } }
              }
            },
            selectedOption: true
          }
        }
      }
    });

    return attempt;
  }

  async getAttemptWithDetails(attemptId: string) {
    return await prisma.testAttempt.findUnique({
      where: { id: attemptId },
      include: {
        test: {
          include: {
            questions: {
              where: { deleted: false },
              include: {
                options: { where: { deleted: false } },
                course: true
              }
            }
          }
        },
        responses: {
          include: {
            question: {
              include: {
                options: { where: { deleted: false } }
              }
            },
            selectedOption: true
          }
        },
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });
  }

  async getUserAttempts(userId: string) {
    return await prisma.testAttempt.findMany({
      where: { userId },
      include: {
        test: true,
        _count: {
          select: { responses: true }
        }
      },
      orderBy: { startedAt: 'desc' }
    });
  }

  async finishAttempt(attemptId: string) {
    const attempt = await prisma.testAttempt.findUnique({
      where: { id: attemptId },
      include: {
        responses: {
          include: {
            question: true,
            selectedOption: true
          }
        }
      }
    });

    if (!attempt) {
      throw new Error('Attempt not found');
    }

    let correctCount = 0;
    for (const response of attempt.responses) {
      if (response.selectedOption && response.question.correctLabel === response.selectedOption.label) {
        correctCount++;
        await prisma.questionResponse.update({
          where: { id: response.id },
          data: { isCorrect: true }
        });
      } else if (response.selectedOptionId) {
        await prisma.questionResponse.update({
          where: { id: response.id },
          data: { isCorrect: false }
        });
      }
    }

    const totalQuestions = attempt.responses.length;
    const score = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;

    return await prisma.testAttempt.update({
      where: { id: attemptId },
      data: {
        status: 'COMPLETED',
        finishedAt: new Date(),
        score
      },
      include: {
        test: true,
        responses: {
          include: {
            question: true,
            selectedOption: true
          }
        }
      }
    });
  }
}

export const testAttemptCRUD = new TestAttemptCRUD();
