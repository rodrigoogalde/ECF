import { Question, QuestionResponse } from "./questions";


export interface TestAttempt {
  id: string;
  testId: string;
  status: string;
  startedAt: string;
  finishedAt: string | null;
  score: number | null;
  test: {
    id: string;
    name: string;
    questions: Question[];
  };
  responses: QuestionResponse[];
}