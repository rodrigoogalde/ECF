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