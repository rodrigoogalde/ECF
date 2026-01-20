import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, Flag } from "lucide-react";
import { ROUTES } from "@/lib/config/routes";

interface AttemptHeaderProps {
  testName: string;
  currentIndex: number;
  totalQuestions: number;
  isCompleted: boolean;
  score?: number | null;
  correctCount?: number;
  answeredCount?: number;
  flaggedCount?: number;
}

export function AttemptHeader({
  testName,
  currentIndex,
  totalQuestions,
  isCompleted,
  score,
  correctCount,
  answeredCount,
  flaggedCount,
}: AttemptHeaderProps) {
  return (
    <>
      <div className="mb-4">
        <Link href={isCompleted ? ROUTES.STUDENT.ATTEMPTS : ROUTES.STUDENT.PRACTICE}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {isCompleted ? 'Volver a Mis Intentos' : 'Volver al Menú'}
          </Button>
        </Link>
      </div>

      {isCompleted ? (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold">{testName}</h1>
            <Badge variant="default" className="bg-green-500 hover:bg-green-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              Completada
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Pregunta {currentIndex + 1} de {totalQuestions}</span>
            <span>•</span>
            <span className="font-medium text-foreground">
              Puntaje: {score?.toFixed(1)}%
            </span>
            <span>•</span>
            <span className="text-green-600 dark:text-green-400">
              {correctCount} correctas
            </span>
            <span>•</span>
            <span className="text-red-600 dark:text-red-400">
              {totalQuestions - (correctCount || 0)} incorrectas
            </span>
          </div>
        </div>
      ) : (
        <div className="mb-4 flex gap-4 text-sm">
          <span className="text-muted-foreground">
            Respondidas: {answeredCount}/{totalQuestions}
          </span>
          {flaggedCount && flaggedCount > 0 && (
            <span className="text-orange-500 flex items-center gap-1">
              <Flag className="h-3 w-3" />
              {flaggedCount} marcadas
            </span>
          )}
        </div>
      )}
    </>
  );
}
