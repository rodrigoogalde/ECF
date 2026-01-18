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
  section: string;
  course: string;
  type: string;
  period: string;
  questions: Question[];
}

export interface QuestionFilters {
  section?: string;
  course?: string;
  type?: string;
  period?: string;
}

import questionSetsData from "../../../data/questions/questions.json";

const questionSets = questionSetsData as QuestionSet[];

export function getQuestionSets(filters: QuestionFilters): QuestionSet[] {
  return questionSets.filter((set) => {
    if (filters.section && set.section !== filters.section) return false;
    if (filters.course && set.course !== filters.course) return false;
    if (filters.type && set.type !== filters.type) return false;
    if (filters.period && set.period !== filters.period) return false;
    return true;
  });
}

export function getAvailableFilters() {
  const sections = [...new Set(questionSets.map((s) => s.section))];
  const courses = [...new Set(questionSets.map((s) => s.course))];
  const types = [...new Set(questionSets.map((s) => s.type))];
  const periods = [...new Set(questionSets.map((s) => s.period))];

  return { sections, courses, types, periods };
}
