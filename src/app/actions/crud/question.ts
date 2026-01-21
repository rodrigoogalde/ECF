import { Question, Prisma } from "@prisma/client";
import { BaseCRUD, QueryOptions } from "./base";
import { prisma } from "@/lib/prisma";
import { QuestionFilters, QuestionSet } from "@/lib/interfaces/questions";

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

  async getQuestionSets(filters: QuestionFilters): Promise<QuestionSet[]> {
    const whereConditions: Prisma.QuestionWhereInput = {
      deleted: false,
    };

    if (filters.period) {
      whereConditions.period = filters.period;
    }
    if (filters.type) {
      whereConditions.type = filters.type;
    }
    if (filters.course) {
      whereConditions.courseCode = filters.course;
    }
    if (filters.section) {
      whereConditions.course = {
        sectionCode: filters.section,
      };
    }

    const questions = await prisma.question.findMany({
      where: whereConditions,
      include: {
        options: {
          where: { deleted: false },
        },
        course: {
          include: {
            section: true,
          },
        },
      },
    });

    const groupedQuestions = questions.reduce((acc, question) => {
      const key = `${question.course.sectionCode}-${question.courseCode}-${question.type}-${question.period}`;
      
      if (!acc[key]) {
        acc[key] = {
          section: question.course.sectionCode,
          course: question.courseCode,
          type: question.type,
          period: question.period,
          questions: [],
        };
      }

      acc[key].questions.push({
        id: question.id,
        uniqueCode: question.uniqueCode,
        title: question.title,
        content: question.content,
        imageUrl: question.imageUrl,
        solution: question.solution,
        options: question.options.map((opt) => ({
          id: opt.id,
          label: opt.label,
          text: opt.text,
          imageUrl: opt.imageUrl,
        })),
        correctLabel: question.correctLabel,
        answer: question.correctLabel || undefined,
      });

      return acc;
    }, {} as Record<string, QuestionSet>);

    return Object.values(groupedQuestions);
  }

  async getAvailableFilters() {
    const questions = await prisma.question.findMany({
      where: { deleted: false },
      select: {
        period: true,
        type: true,
        courseCode: true,
        course: {
          select: {
            sectionCode: true,
          },
        },
      },
    });

    const sections = [...new Set(questions.map(q => q.course.sectionCode))];
    const courses = [...new Set(questions.map(q => q.courseCode))];
    const types = [...new Set(questions.map(q => q.type))];
    const periods = [...new Set(questions.map(q => q.period))];

    return { sections, courses, types, periods };
  }
}

export const questionCRUD = new QuestionCRUD();
