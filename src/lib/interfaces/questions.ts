export interface Option {
  id: number;
  label: string;
  text: string;
  imageUrl: string[];
}

export interface Question {
  id: string;
  uniqueCode: string;
  title: string;
  content: string;
  imageUrl: string[];
  solution: string | null;
  options: Option[];
  correctLabel: string | null;
  answer?: string;
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


export interface QuestionsContentProps {
  questionSets: QuestionSet[];
  availableFilters: {
    sections: string[];
    courses: string[];
    types: string[];
    periods: string[];
  };
  initialFilters: QuestionFilters;
}

export interface QuestionResponse {
  id: string;
  questionId: string;
  selectedOptionId: number | null;
  timeSpent: number;
  switchCount: number;
  flagged: boolean;
  isCorrect: boolean | null;
  question: Question;
  selectedOption: Option | null;
}
