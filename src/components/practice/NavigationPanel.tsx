import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface QuestionResponse {
  id: string;
  selectedOptionId: number | null;
  flagged: boolean;
  isCorrect?: boolean | null;
}

interface NavigationPanelProps {
  responses: QuestionResponse[];
  currentIndex: number;
  onQuestionSelect: (index: number) => void;
  testName: string;
  elapsedTime?: number;
  formatTime?: (seconds: number) => string;
  onFinish?: () => void;
  isCompleted: boolean;
}

export function NavigationPanel({
  responses,
  currentIndex,
  onQuestionSelect,
  testName,
  elapsedTime,
  formatTime,
  onFinish,
  isCompleted,
}: NavigationPanelProps) {
  const totalQuestions = responses.length;
  const [isTimerExpanded, setIsTimerExpanded] = useState(true);

  return (
    <div className="lg:sticky lg:top-4 lg:self-start">
      <Card className="w-[250px] p-2">
        <CardContent className="p-2">
          <div className="mb-4">
            <div>
              <h1 className="text-xl font-bold">{testName}</h1>
              <p className="text-sm text-muted-foreground">
                Pregunta {currentIndex + 1} de {totalQuestions}
              </p>
            </div>
            {!isCompleted && onFinish && elapsedTime !== undefined && formatTime && (
              <div className="flex items-center gap-4 mt-3">
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={onFinish}
                >
                  Finalizar
                </Button>
                <motion.div
                  onClick={() => setIsTimerExpanded(!isTimerExpanded)}
                  className="cursor-pointer"
                  layout
                >
                  <Badge variant="outline" className="text-base px-3 py-1 inline-flex items-center h-[32px]">
                    <Clock className="h-4 w-4 flex-shrink-0" />
                    <AnimatePresence mode="wait">
                      {isTimerExpanded && (
                        <motion.span
                          initial={{ width: 0, opacity: 0, marginLeft: 0 }}
                          animate={{ width: "auto", opacity: 1, marginLeft: 8 }}
                          exit={{ width: 0, opacity: 0, marginLeft: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden whitespace-nowrap inline-block"
                        >
                          {formatTime(elapsedTime)}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Badge>
                </motion.div>
              </div>
            )}
          </div>

          <h3 className="font-semibold mb-3">Navegación</h3>
          
          {isCompleted ? (
            <div className="mb-4 flex gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Correcta</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>Incorrecta</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span>Sin resp.</span>
              </div>
            </div>
          ) : (
            <div className="mb-4 flex gap-2 text-xs flex-wrap">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-primary rounded"></div>
                <span>Respondida</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-muted rounded border"></div>
                <span>Sin resp.</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-orange-500 rounded"></div>
                <span>Marcada</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-5 gap-2">
            {responses.map((response, idx) => (
              <button
                key={response.id}
                onClick={() => onQuestionSelect(idx)}
                className={`
                  w-full aspect-square text-xs font-medium rounded border-2 transition-colors
                  ${idx === currentIndex ? 'ring-2 ring-primary' : ''}
                  ${isCompleted
                    ? response.isCorrect 
                      ? 'bg-green-500 text-white border-green-600 hover:bg-green-600' 
                      : response.selectedOptionId !== null
                        ? 'bg-red-500 text-white border-red-600 hover:bg-red-600'
                        : 'bg-yellow-500 text-white border-yellow-600 hover:bg-yellow-600'
                    : response.selectedOptionId !== null 
                      ? 'bg-primary text-primary-foreground border-primary' 
                      : 'bg-muted hover:bg-muted/80 border-muted'}
                  ${!isCompleted && response.flagged ? 'border-orange-500' : ''}
                `}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
