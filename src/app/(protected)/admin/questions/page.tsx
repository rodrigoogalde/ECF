"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { MathRenderer } from "@/components/MathRenderer";
import { getQuestionSets, getAvailableFilters } from "@/lib/interfaces/questions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/lib/config/routes";
import { Plus, Pencil } from "lucide-react";

function QuestionCard({
  question,
}: {
  question: {
    id: number;
    title: string;
    code: string;
    content: string;
    options: { label: string; text: string }[];
    answer?: string;
    solution?: string;
    image?: string;
  };
}) {
  const router = useRouter();
  const [showAnswer, setShowAnswer] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg">{question.title}</CardTitle>
            <Badge variant="secondary">{question.code}</Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(ROUTES.ADMIN.QUESTIONS.EDIT(question.id))}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <MathRenderer content={question.content} />
        </div>

        {question.image && (
          <div className="my-4">
            <img
              src={question.image}
              alt={`Imagen para ${question.title}`}
              className="max-w-full h-auto rounded-lg border"
            />
          </div>
        )}

        <div className="space-y-2">
          {question.options.map((option) => (
            <div
              key={option.label}
              className={`p-3 rounded-lg border transition-colors ${
                showAnswer && question.answer && option.label === question.answer
                  ? "bg-green-100 border-green-500 dark:bg-green-900/30"
                  : "bg-muted/50"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold">{option.label})</span>
                <MathRenderer content={option.text} inline />
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-4">
          {question.answer && (
            <Button
              variant={showAnswer ? "default" : "outline"}
              size="sm"
              onClick={() => setShowAnswer(!showAnswer)}
            >
              {showAnswer ? "Ocultar Respuesta" : "Ver Respuesta"}
            </Button>
          )}
          {question.solution && (
            <Button
              variant={showSolution ? "default" : "outline"}
              size="sm"
              onClick={() => setShowSolution(!showSolution)}
            >
              {showSolution ? "Ocultar Solución" : "Ver Solución"}
            </Button>
          )}
        </div>

        {showSolution && question.solution && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold mb-2">Solución:</h4>
            <MathRenderer content={question.solution} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function QuestionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = {
    section: searchParams.get("section") || undefined,
    course: searchParams.get("course") || undefined,
    type: searchParams.get("type") || undefined,
    period: searchParams.get("period") || undefined,
  };

  const questionSets = getQuestionSets(filters);
  const availableFilters = getAvailableFilters();

  const hasFilters = Object.values(filters).some((v) => v);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Banco de Preguntas</h1>
        <Button onClick={() => router.push(ROUTES.ADMIN.QUESTIONS.CREATE)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Pregunta
        </Button>
      </div>

      {/* Filtros activos */}
      {hasFilters && (
        <div className="mb-6 flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Filtros:</span>
          {filters.section && <Badge>Módulo: {filters.section}</Badge>}
          {filters.course && <Badge>Curso: {filters.course}</Badge>}
          {filters.type && <Badge>Tipo: {filters.type}</Badge>}
          {filters.period && <Badge>Período: {filters.period}</Badge>}
          <a href={ROUTES.ADMIN.QUESTIONS.LIST}>
            <Button variant="ghost" size="sm">
              Limpiar filtros
            </Button>
          </a>
        </div>
      )}

      {/* Filtros disponibles */}
      <div className="mb-8 p-4 bg-muted/50 rounded-lg">
        <h2 className="font-semibold mb-3">Filtrar por:</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm text-muted-foreground block mb-1">
              Módulo
            </label>
            <select
              className="w-full p-2 rounded border bg-background"
              value={filters.section || ""}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams.toString());
                if (e.target.value) {
                  params.set("section", e.target.value);
                } else {
                  params.delete("section");
                }
                window.location.href = `${ROUTES.ADMIN.QUESTIONS.LIST}?${params.toString()}`;
              }}
            >
              <option value="">Todos</option>
              {availableFilters.sections.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground block mb-1">
              Curso
            </label>
            <select
              className="w-full p-2 rounded border bg-background"
              value={filters.course || ""}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams.toString());
                if (e.target.value) {
                  params.set("course", e.target.value);
                } else {
                  params.delete("course");
                }
                window.location.href = `${ROUTES.ADMIN.QUESTIONS.LIST}?${params.toString()}`;
              }}
            >
              <option value="">Todos</option>
              {availableFilters.courses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground block mb-1">
              Tipo
            </label>
            <select
              className="w-full p-2 rounded border bg-background"
              value={filters.type || ""}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams.toString());
                if (e.target.value) {
                  params.set("type", e.target.value);
                } else {
                  params.delete("type");
                }
                window.location.href = `${ROUTES.ADMIN.QUESTIONS.LIST}?${params.toString()}`;
              }}
            >
              <option value="">Todos</option>
              {availableFilters.types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground block mb-1">
              Período
            </label>
            <select
              className="w-full p-2 rounded border bg-background"
              value={filters.period || ""}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams.toString());
                if (e.target.value) {
                  params.set("period", e.target.value);
                } else {
                  params.delete("period");
                }
                window.location.href = `${ROUTES.ADMIN.QUESTIONS.LIST}?${params.toString()}`;
              }}
            >
              <option value="">Todos</option>
              {availableFilters.periods.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Preguntas */}
      {questionSets.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No se encontraron preguntas con los filtros seleccionados.
        </div>
      ) : (
        questionSets.map((set, index) => (
          <div key={`${set.section}-${set.course}-${set.type}-${set.period}-${index}`}>
            <h2 className="text-xl font-semibold mb-4">
              {set.course} - {set.type} ({set.period})
            </h2>
            {set.questions.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))}
          </div>
        ))
      )}
    </div>
  );
}

export default function QuestionsPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto py-8 px-4">Cargando...</div>
      }
    >
      <QuestionsContent />
    </Suspense>
  );
}
