'use server';

import { testAttemptCRUD } from "../crud/testAttempt";
import { questionResponseCRUD } from "../crud/questionResponse";
import { Prisma } from "@prisma/client";

export async function getAllTestAttempts(filters?: Prisma.TestAttemptWhereInput) {
  return await testAttemptCRUD.getAll(filters);
}

export async function getTestAttemptById(id: string) {
  return await testAttemptCRUD.getOne({ id });
}

export async function getAttemptWithDetails(attemptId: string) {
  return await testAttemptCRUD.getAttemptWithDetails(attemptId);
}

export async function getUserAttempts(userId: string) {
  return await testAttemptCRUD.getUserAttempts(userId);
}

export async function startTestAttempt(userId: string, testId: string) {
  return await testAttemptCRUD.startAttempt(userId, testId);
}

export async function finishTestAttempt(attemptId: string) {
  return await testAttemptCRUD.finishAttempt(attemptId);
}

export async function updateTestAttempt(id: string, data: Prisma.TestAttemptUpdateInput) {
  return await testAttemptCRUD.update(id, data);
}

export async function updateQuestionResponse(
  attemptId: string,
  questionId: string,
  data: {
    selectedOptionId?: number | null;
    timeSpent?: number;
    switchCount?: number;
    flagged?: boolean;
  }
) {
  return await questionResponseCRUD.updateResponse(attemptId, questionId, data);
}

export async function getQuestionResponse(attemptId: string, questionId: string) {
  return await questionResponseCRUD.getResponseByAttemptAndQuestion(attemptId, questionId);
}

export async function getAttemptResponses(attemptId: string) {
  return await questionResponseCRUD.getAttemptResponses(attemptId);
}
