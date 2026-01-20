'use server';

import { questionCRUD } from "../crud/question";
import { testCRUD } from "../crud/test";
import { Prisma } from "@prisma/client";

export interface TestFilters {
  period?: string;
  courseCode?: string;
  sectionCode?: string;
  type?: string;
}

export async function getFilteredQuestionsForTest(filters: TestFilters) {
  const whereConditions: Prisma.QuestionWhereInput = {
    deleted: false,
  };

  if (filters.period) {
    whereConditions.period = filters.period;
  }
  if (filters.type) {
    whereConditions.type = filters.type;
  }
  if (filters.courseCode) {
    whereConditions.courseCode = filters.courseCode;
  }
  if (filters.sectionCode) {
    whereConditions.course = {
      sectionCode: filters.sectionCode,
    };
  }

  const questions = await questionCRUD.getAll(whereConditions, {
    orderBy: { title: 'asc' }
  });
  
  return questions.map(q => ({
    id: q.id,
    uniqueCode: q.uniqueCode,
    title: q.title,
    content: q.content,
    period: q.period,
    type: q.type,
    courseCode: q.courseCode,
  }));
}

export async function createTestFromFilters(name: string, filters: TestFilters) {
  const questions = await getFilteredQuestionsForTest(filters);
  const questionIds = questions.map(q => q.id);
  
  if (questionIds.length === 0) {
    throw new Error("No se encontraron preguntas con los filtros especificados");
  }
  
  return await testCRUD.createTestWithQuestions(name, questionIds);
}

export async function getTestCreationFilters() {
  return await questionCRUD.getAvailableFilters();
}
