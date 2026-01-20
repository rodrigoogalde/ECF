'use server';

import { questionCRUD } from "../crud/question";
import { questionSchema } from "@/lib/validations/question";
import { Prisma } from "@prisma/client";
import { QuestionFilters } from "@/lib/interfaces/questions";

export async function getAllQuestions(filters?: Prisma.QuestionWhereInput) {
  return await questionCRUD.getAll(filters);
}

export async function getQuestionById(id: string) {
  return await questionCRUD.getOne({ id });
}

export async function getQuestionByUniqueCode(uniqueCode: string) {
  return await questionCRUD.getOne({ uniqueCode });
}

export async function createQuestion(data: unknown) {
  const validatedData = questionSchema.parse(data);
  
  return await questionCRUD.create({
    uniqueCode: validatedData.uniqueCode,
    title: validatedData.title,
    content: validatedData.content,
    period: validatedData.period,
    type: validatedData.type,
    solution: validatedData.solution,
    imageUrl: validatedData.imageUrl,
    correctLabel: validatedData.correctLabel,
    course: {
      connect: { code: validatedData.courseCode }
    }
  });
}

export async function updateQuestion(id: string, data: unknown) {
  const validatedData = questionSchema.partial().parse(data);
  
  const updateData: Prisma.QuestionUpdateInput = {
    ...(validatedData.uniqueCode && { uniqueCode: validatedData.uniqueCode }),
    ...(validatedData.title && { title: validatedData.title }),
    ...(validatedData.content && { content: validatedData.content }),
    ...(validatedData.period && { period: validatedData.period }),
    ...(validatedData.type && { type: validatedData.type }),
    ...(validatedData.solution !== undefined && { solution: validatedData.solution }),
    ...(validatedData.imageUrl && { imageUrl: validatedData.imageUrl }),
    ...(validatedData.correctLabel !== undefined && { correctLabel: validatedData.correctLabel }),
    ...(validatedData.courseCode && { 
      course: { connect: { code: validatedData.courseCode } }
    })
  };
  
  return await questionCRUD.update(id, updateData);
}

export async function deleteQuestion(id: string, isSoft: boolean = true) {
  return await questionCRUD.delete(id, isSoft);
}

export async function getQuestionSetsAction(filters: QuestionFilters) {
  return await questionCRUD.getQuestionSets(filters);
}

export async function getAvailableFiltersAction() {
  return await questionCRUD.getAvailableFilters();
}