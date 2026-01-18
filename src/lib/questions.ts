export interface QuestionOption {
  label: string;
  text: string;
}

export interface Question {
  id: number;
  title: string;
  code: string;
  content: string;
  options: QuestionOption[];
  answer?: string;
  solution?: string;
  image?: string;
}

export interface QuestionSet {
  module: string;
  course: string;
  type: string;
  period: string;
  questions: Question[];
}

export interface QuestionFilters {
  module?: string;
  course?: string;
  type?: string;
  period?: string;
}

import questionSetsData from "../../data/questions/questions.json";

const questionSets = questionSetsData as QuestionSet[];

export function getQuestionSets(filters: QuestionFilters): QuestionSet[] {
  return questionSets.filter((set) => {
    if (filters.module && set.module !== filters.module) return false;
    if (filters.course && set.course !== filters.course) return false;
    if (filters.type && set.type !== filters.type) return false;
    if (filters.period && set.period !== filters.period) return false;
    return true;
  });
}

export function getAvailableFilters() {
  const modules = [...new Set(questionSets.map((s) => s.module))];
  const courses = [...new Set(questionSets.map((s) => s.course))];
  const types = [...new Set(questionSets.map((s) => s.type))];
  const periods = [...new Set(questionSets.map((s) => s.period))];

  return { modules, courses, types, periods };
}
