import { Suspense } from "react";
import { QuestionsContent } from "@/components/question/QuestionsContent";
import { getQuestionSetsAction, getAvailableFiltersAction } from "@/app/actions/routes/question";

interface PageProps {
  searchParams: {
    section?: string;
    course?: string;
    type?: string;
    period?: string;
  };
}

async function QuestionsDataLoader({ searchParams }: PageProps) {
  const filters = {
    section: searchParams.section,
    course: searchParams.course,
    type: searchParams.type,
    period: searchParams.period,
  };

  const [questionSets, availableFilters] = await Promise.all([
    getQuestionSetsAction(filters),
    getAvailableFiltersAction(),
  ]);

  return (
    <QuestionsContent
      questionSets={questionSets}
      availableFilters={availableFilters}
      initialFilters={filters}
    />
  );
}

export default function QuestionsPage({ searchParams }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto py-8 px-4">Cargando...</div>
      }
    >
      <QuestionsDataLoader searchParams={searchParams} />
    </Suspense>
  );
}
