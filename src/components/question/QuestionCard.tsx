"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MathRenderer } from "@/components/MathRenderer";
import { ROUTES } from "@/lib/config/routes";
import { Pencil, Flag, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Question } from "@/lib/interfaces/questions";

interface QuestionCardProps {
  question: Question;
  mode?: "view" | "practice";
  selectedOptionLabel?: string | null;
  flagged?: boolean;
  timeSpent?: number;
  switchCount?: number;
  onSelectOption?: (label: string | null) => void;
  onToggleFlag?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  currentIndex?: number;
  totalQuestions?: number;
}

export function QuestionCard({ 
  question,
  mode = "view",
  selectedOptionLabel = null,
  flagged = false,
  timeSpent = 0,
  onSelectOption,
  onToggleFlag,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false,
  currentIndex = 0,
  totalQuestions = 1,
}: QuestionCardProps) {
  const router = useRouter();
  const [showAnswer, setShowAnswer] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const isPracticeMode = mode === "practice";

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOptionClick = (label: string) => {
    if (!isPracticeMode || !onSelectOption) return;
    onSelectOption(selectedOptionLabel === label ? null : label);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg">{question.title}</CardTitle>
            <Badge variant="secondary">{question.code}</Badge>
            {isPracticeMode && flagged && (
              <Badge variant="outline" className="border-orange-500 text-orange-500">
                <Flag className="h-3 w-3 mr-1" />
                Marcada
              </Badge>
            )}
          </div>
          {!isPracticeMode && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(ROUTES.ADMIN.QUESTIONS.EDIT(question.id))}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          {isPracticeMode && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {formatTime(timeSpent)}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <MathRenderer content={question.content} />
        </div>

        {question.image && (
          <div className="my-4 flex justify-center">
            <div className="relative w-full max-w-3xl">
              <Image
                src={question.image}
                alt={`Imagen para ${question.title}`}
                width={800}
                height={600}
                className="w-full h-auto rounded-lg border object-contain max-h-[500px]"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          {question.options.map((option) => {
            const isSelected = isPracticeMode && selectedOptionLabel === option.label;
            const isCorrectAnswer = showAnswer && question.answer && option.label === question.answer;
            
            return (
              <div
                key={option.label}
                onClick={() => handleOptionClick(option.label)}
                className={`p-3 rounded-lg border transition-colors ${
                  isPracticeMode ? 'cursor-pointer' : ''
                } ${
                  isSelected
                    ? "bg-primary/10 border-primary ring-2 ring-primary"
                    : isCorrectAnswer
                    ? "bg-green-100 border-green-500 dark:bg-green-900/30"
                    : "bg-muted/50 hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`
                    flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-semibold text-sm
                    ${isSelected 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted-foreground/20"}
                  `}>
                    {option.label}
                  </span>
                  <MathRenderer content={option.text} inline />
                </div>
              </div>
            );
          })}
        </div>

        {!isPracticeMode && (
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
        )}

        {isPracticeMode && (
          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={!hasPrevious}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Anterior
            </Button>

            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {currentIndex + 1} / {totalQuestions}
              </span>
              <Button
                variant={flagged ? "default" : "outline"}
                size="icon"
                onClick={onToggleFlag}
                className={flagged ? "bg-orange-500 hover:bg-orange-600" : ""}
              >
                <Flag className="h-4 w-4" />
              </Button>
            </div>

            <Button
              variant="outline"
              onClick={onNext}
              disabled={!hasNext}
            >
              Siguiente
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}

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
