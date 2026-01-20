"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ChevronLeft, ChevronRight, Flag, Clock, CheckCircle, ArrowLeft } from "lucide-react";
import { getAttemptWithDetails, updateQuestionResponse, finishTestAttempt } from "@/app/actions/routes/testAttempt";
import { PracticeQuestionCard } from "@/components/question/PracticeQuestionCard";
import { ReviewQuestionCard } from "@/components/question/ReviewQuestionCard";
import { ROUTES } from "@/lib/config/routes";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Option {
  id: number;
  label: string;
  text: string;
  imageUrl: string[];
}

interface Question {
  id: string;
  uniqueCode: string;
  title: string;
  content: string;
  imageUrl: string[];
  solution: string | null;
  options: Option[];
  correctLabel: string | null;
}

interface QuestionResponse {
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

interface TestAttempt {
  id: string;
  testId: string;
  status: string;
  startedAt: string;
  finishedAt: string | null;
  score: number | null;
  test: {
    id: string;
    name: string;
    questions: Question[];
  };
  responses: QuestionResponse[];
}

export default function AttemptPage() {
  const params = useParams();
  const router = useRouter();
  const attemptId = params.id as string;

  const [attempt, setAttempt] = useState<TestAttempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showFinishDialog, setShowFinishDialog] = useState(false);
  const [finishing, setFinishing] = useState(false);

  const questionStartTime = useRef<number>(Date.now());
  const currentQuestionTime = useRef<number>(0);

  useEffect(() => {
    async function loadAttempt() {
      try {
        const data = await getAttemptWithDetails(attemptId);
        if (!data) {
          router.push(ROUTES.STUDENT.PRACTICE);
          return;
        }
        setAttempt(data as unknown as TestAttempt);
        
        if (data.startedAt) {
          const startTime = new Date(data.startedAt).getTime();
          setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
        }
      } catch (error) {
        console.error("Error loading attempt:", error);
        router.push(ROUTES.STUDENT.PRACTICE);
      } finally {
        setLoading(false);
      }
    }
    loadAttempt();
  }, [attemptId, router]);

  useEffect(() => {
    if (attempt?.status === 'COMPLETED') return;
    
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [attempt?.status]);

  useEffect(() => {
    questionStartTime.current = Date.now();
    currentQuestionTime.current = 0;
  }, [currentIndex]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const saveTimeSpent = useCallback(async () => {
    if (!attempt) return;
    
    const currentResponse = attempt.responses[currentIndex];
    if (!currentResponse) return;

    const additionalTime = Math.floor((Date.now() - questionStartTime.current) / 1000);
    const totalTime = currentResponse.timeSpent + additionalTime;

    try {
      await updateQuestionResponse(attemptId, currentResponse.questionId, {
        timeSpent: totalTime
      });
    } catch (error) {
      console.error("Error saving time:", error);
    }
  }, [attempt, attemptId, currentIndex]);

  const handlePrevious = async () => {
    if (currentIndex > 0) {
      await saveTimeSpent();
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleNext = async () => {
    if (attempt && currentIndex < attempt.responses.length - 1) {
      await saveTimeSpent();
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleSelectOption = async (optionId: number | null) => {
    if (!attempt) return;
    
    const currentResponse = attempt.responses[currentIndex];
    if (!currentResponse) return;

    try {
      await updateQuestionResponse(attemptId, currentResponse.questionId, {
        selectedOptionId: optionId
      });

      setAttempt(prev => {
        if (!prev) return prev;
        const newResponses = [...prev.responses];
        newResponses[currentIndex] = {
          ...newResponses[currentIndex],
          selectedOptionId: optionId,
          selectedOption: optionId 
            ? currentResponse.question.options.find(o => o.id === optionId) || null 
            : null
        };
        return { ...prev, responses: newResponses };
      });
    } catch (error) {
      console.error("Error updating response:", error);
    }
  };

  const handleToggleFlag = async () => {
    if (!attempt) return;
    
    const currentResponse = attempt.responses[currentIndex];
    if (!currentResponse) return;

    const newFlagged = !currentResponse.flagged;

    try {
      await updateQuestionResponse(attemptId, currentResponse.questionId, {
        flagged: newFlagged
      });

      setAttempt(prev => {
        if (!prev) return prev;
        const newResponses = [...prev.responses];
        newResponses[currentIndex] = {
          ...newResponses[currentIndex],
          flagged: newFlagged
        };
        return { ...prev, responses: newResponses };
      });
    } catch (error) {
      console.error("Error toggling flag:", error);
    }
  };

  const handleFinishTest = async () => {
    setFinishing(true);
    try {
      await saveTimeSpent();
      await finishTestAttempt(attemptId);
      router.push(ROUTES.STUDENT.PRACTICE);
    } catch (error) {
      console.error("Error finishing test:", error);
      setFinishing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!attempt) {
    return null;
  }

  const currentResponse = attempt.responses[currentIndex];
  const totalQuestions = attempt.responses.length;
  const answeredCount = attempt.responses.filter(r => r.selectedOptionId !== null).length;
  const flaggedCount = attempt.responses.filter(r => r.flagged).length;

  if (attempt.status === 'COMPLETED') {
    const correctCount = attempt.responses.filter(r => r.isCorrect).length;
    
    return (
      <div className="container mx-auto py-4 px-4 max-w-7xl">
        <div className="mb-4">
          <Link href={ROUTES.STUDENT.ATTEMPTS}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Mis Intentos
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold">{attempt.test.name}</h1>
            <Badge variant="default" className="bg-green-500 hover:bg-green-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              Completada
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Pregunta {currentIndex + 1} de {totalQuestions}</span>
            <span>•</span>
            <span className="font-medium text-foreground">
              Puntaje: {attempt.score?.toFixed(1)}%
            </span>
            <span>•</span>
            <span className="text-green-600 dark:text-green-400">
              {correctCount} correctas
            </span>
            <span>•</span>
            <span className="text-red-600 dark:text-red-400">
              {totalQuestions - correctCount} incorrectas
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          <div>
            {currentResponse && (
              <ReviewQuestionCard
                question={currentResponse.question}
                selectedOptionId={currentResponse.selectedOptionId}
                isCorrect={currentResponse.isCorrect}
              />
            )}

            <div className="mt-6 flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Anterior
              </Button>

              <Button
                variant="outline"
                onClick={() => setCurrentIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
                disabled={currentIndex === totalQuestions - 1}
              >
                Siguiente
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>

          <div className="lg:sticky lg:top-4 lg:self-start">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Navegación</h3>
                
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

                <div className="grid grid-cols-5 gap-2">
                  {attempt.responses.map((response, idx) => (
                    <button
                      key={response.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`
                        w-full aspect-square text-xs font-medium rounded border-2 transition-colors
                        ${idx === currentIndex ? 'ring-2 ring-primary' : ''}
                        ${response.isCorrect 
                          ? 'bg-green-500 text-white border-green-600 hover:bg-green-600' 
                          : response.selectedOptionId !== null
                            ? 'bg-red-500 text-white border-red-600 hover:bg-red-600'
                            : 'bg-yellow-500 text-white border-yellow-600 hover:bg-yellow-600'}
                      `}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 px-4 max-w-4xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">{attempt.test.name}</h1>
          <p className="text-sm text-muted-foreground">
            Pregunta {currentIndex + 1} de {totalQuestions}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-base px-3 py-1">
            <Clock className="h-4 w-4 mr-2" />
            {formatTime(elapsedTime)}
          </Badge>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => setShowFinishDialog(true)}
          >
            Finalizar
          </Button>
        </div>
      </div>

      <div className="mb-4 flex gap-1 flex-wrap">
        {attempt.responses.map((response, idx) => (
          <button
            key={response.id}
            onClick={async () => {
              await saveTimeSpent();
              setCurrentIndex(idx);
            }}
            className={`
              w-8 h-8 text-xs font-medium rounded border transition-colors
              ${idx === currentIndex ? 'ring-2 ring-primary' : ''}
              ${response.selectedOptionId !== null 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted hover:bg-muted/80'}
              ${response.flagged ? 'border-orange-500 border-2' : 'border-transparent'}
            `}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      <div className="mb-4 flex gap-4 text-sm">
        <span className="text-muted-foreground">
          Respondidas: {answeredCount}/{totalQuestions}
        </span>
        {flaggedCount > 0 && (
          <span className="text-orange-500 flex items-center gap-1">
            <Flag className="h-3 w-3" />
            {flaggedCount} marcadas
          </span>
        )}
      </div>

      {currentResponse && (
        <PracticeQuestionCard
          question={currentResponse.question}
          selectedOptionId={currentResponse.selectedOptionId}
          flagged={currentResponse.flagged}
          onSelectOption={handleSelectOption}
          onToggleFlag={handleToggleFlag}
        />
      )}

      <div className="mt-6 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Anterior
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant={currentResponse?.flagged ? "default" : "outline"}
            size="icon"
            onClick={handleToggleFlag}
            className={currentResponse?.flagged ? "bg-orange-500 hover:bg-orange-600" : ""}
          >
            <Flag className="h-4 w-4" />
          </Button>
        </div>

        <Button
          variant="outline"
          onClick={handleNext}
          disabled={currentIndex === totalQuestions - 1}
        >
          Siguiente
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      <AlertDialog open={showFinishDialog} onOpenChange={setShowFinishDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Finalizar prueba?</AlertDialogTitle>
            <AlertDialogDescription>
              Has respondido {answeredCount} de {totalQuestions} preguntas.
              {flaggedCount > 0 && ` Tienes ${flaggedCount} preguntas marcadas para revisar.`}
              <br /><br />
              Una vez finalizada, no podrás modificar tus respuestas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleFinishTest} disabled={finishing}>
              {finishing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Finalizando...
                </>
              ) : (
                "Finalizar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
