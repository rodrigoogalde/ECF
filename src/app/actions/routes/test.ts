'use server';

import { testCRUD } from "../crud/test";
import { Prisma } from "@prisma/client";

export async function getAllTests(filters?: Prisma.TestWhereInput) {
  return await testCRUD.getAll(filters);
}

export async function getTestById(id: string) {
  return await testCRUD.getOne({ id });
}

export async function getTestByName(name: string) {
  return await testCRUD.getOne({ name });
}

export async function getTestWithQuestions(testId: string) {
  return await testCRUD.getTestWithQuestions(testId);
}

export async function createTest(name: string) {
  return await testCRUD.create({ name });
}

export async function createTestWithQuestions(name: string, questionIds: string[]) {
  return await testCRUD.createTestWithQuestions(name, questionIds);
}

export async function updateTest(id: string, data: Prisma.TestUpdateInput) {
  return await testCRUD.update(id, data);
}

export async function addQuestionsToTest(testId: string, questionIds: string[]) {
  return await testCRUD.addQuestionsToTest(testId, questionIds);
}

export async function removeQuestionsFromTest(testId: string, questionIds: string[]) {
  return await testCRUD.removeQuestionsFromTest(testId, questionIds);
}
