"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROUTES } from "@/lib/config/routes";
import { Plus } from "lucide-react";
import { QuestionsContentProps } from "@/lib/interfaces/questions";
import { QuestionCard } from "./QuestionCard";


export function QuestionsContent({
  questionSets,
  availableFilters,
  initialFilters,
}: QuestionsContentProps) {
  const router = useRouter();
  const filters = initialFilters;

  const hasFilters = Object.values(filters).some((v) => v);

  const buildFilterUrl = (key: string, value: string) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v && k !== key) {
        params.set(k, v);
      }
    });
    if (value && value !== "all") {
      params.set(key, value);
    }
    const queryString = params.toString();
    return queryString ? `${ROUTES.ADMIN.QUESTIONS.LIST}?${queryString}` : ROUTES.ADMIN.QUESTIONS.LIST;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Banco de Preguntas</h1>
        <Button onClick={() => router.push(ROUTES.ADMIN.QUESTIONS.CREATE)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Pregunta
        </Button>
      </div>

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

      <div className="mb-8 p-4 bg-muted/50 rounded-lg">
        <h2 className="font-semibold mb-3">Filtrar por:</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              Módulo
            </Label>
            <Select
              value={filters.section || "all"}
              onValueChange={(value) => {
                window.location.href = buildFilterUrl("section", value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {availableFilters.sections.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              Curso
            </Label>
            <Select
              value={filters.course || "all"}
              onValueChange={(value) => {
                window.location.href = buildFilterUrl("course", value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {availableFilters.courses.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              Tipo
            </Label>
            <Select
              value={filters.type || "all"}
              onValueChange={(value) => {
                window.location.href = buildFilterUrl("type", value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {availableFilters.types.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              Período
            </Label>
            <Select
              value={filters.period || "all"}
              onValueChange={(value) => {
                window.location.href = buildFilterUrl("period", value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {availableFilters.periods.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

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
              <QuestionCard key={`${question.id}-${question.code}`} question={question} />
            ))}
          </div>
        ))
      )}
    </div>
  );
}
