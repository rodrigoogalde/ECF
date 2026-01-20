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
import { FinishModal } from "@/components/practice/finishModal";
import { NavigationPanel } from "@/components/practice/NavigationPanel";
import { QuestionNavigation } from "@/components/QuestionNavigation";
import { AttemptHeader } from "@/components/practice/AttemptHeader";
import formatTime from "@/lib/utils/question";

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

  // Start timer when attempt is started
  useEffect(() => {
    if (attempt?.status === 'COMPLETED') return;
    
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [attempt?.status]);

  // Start timer when question is selected
  useEffect(() => {
    questionStartTime.current = Date.now();
    currentQuestionTime.current = 0;
  }, [currentIndex]);


  const saveTimeSpent = useCallback(async () => {
    if (!attempt) return;
    
    const currentResponse = attempt.responses[currentIndex];
    if (!currentResponse) return;

    const additionalTime = Math.floor((Date.now() - questionStartTime.current) / 1000);

    if (additionalTime <= 0) return;

    try {
      await updateQuestionResponse(attemptId, currentResponse.questionId, {
        timeSpent: additionalTime
      });

      setAttempt(prev => {
        if (!prev) return prev;
        const newResponses = [...prev.responses];
        newResponses[currentIndex] = {
          ...newResponses[currentIndex],
          timeSpent: newResponses[currentIndex].timeSpent + additionalTime
        };
        return { ...prev, responses: newResponses };
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
        const selectedOption = optionId 
          ? currentResponse.question.options.find(o => o.id === optionId) || null 
          : null;
        const isCorrect = optionId === null 
          ? null 
          : selectedOption?.label === currentResponse.question.correctLabel;
        
        newResponses[currentIndex] = {
          ...newResponses[currentIndex],
          selectedOptionId: optionId,
          selectedOption,
          isCorrect
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
  const isCompleted = attempt.status === 'COMPLETED';
  const correctCount = isCompleted ? attempt.responses.filter(r => r.isCorrect).length : 0;

  return (
    <div className="container mx-auto py-4 px-4 max-w-7xl">
      <AttemptHeader
        testName={attempt.test.name}
        currentIndex={currentIndex}
        totalQuestions={totalQuestions}
        isCompleted={isCompleted}
        score={isCompleted ? attempt.score : undefined}
        correctCount={isCompleted ? correctCount : undefined}
        answeredCount={!isCompleted ? answeredCount : undefined}
        flaggedCount={!isCompleted ? flaggedCount : undefined}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div>
          {currentResponse && (
            isCompleted ? (
              <ReviewQuestionCard
                question={currentResponse.question}
                selectedOptionId={currentResponse.selectedOptionId}
                isCorrect={currentResponse.isCorrect}
              />
            ) : (
              <PracticeQuestionCard
                question={currentResponse.question}
                selectedOptionId={currentResponse.selectedOptionId}
                flagged={currentResponse.flagged}
                onSelectOption={handleSelectOption}
                onToggleFlag={handleToggleFlag}
              />
            )
          )}

          <QuestionNavigation
            currentIndex={currentIndex}
            totalQuestions={totalQuestions}
            isFlagged={!isCompleted ? currentResponse?.flagged || false : undefined}
            onPrevious={isCompleted 
              ? () => setCurrentIndex(prev => Math.max(0, prev - 1))
              : handlePrevious
            }
            onNext={isCompleted
              ? () => setCurrentIndex(prev => Math.min(totalQuestions - 1, prev + 1))
              : handleNext
            }
            onToggleFlag={!isCompleted ? handleToggleFlag : undefined}
          />
        </div>

        <NavigationPanel
          responses={attempt.responses}
          currentIndex={currentIndex}
          onQuestionSelect={isCompleted
            ? (idx) => setCurrentIndex(idx)
            : async (idx) => {
                await saveTimeSpent();
                setCurrentIndex(idx);
              }
          }
          testName={attempt.test.name}
          elapsedTime={!isCompleted ? elapsedTime : undefined}
          formatTime={!isCompleted ? formatTime : undefined}
          onFinish={!isCompleted ? () => setShowFinishDialog(true) : undefined}
          isCompleted={isCompleted}
        />
      </div>

      {!isCompleted && (
        <FinishModal
          open={showFinishDialog}
          onOpenChange={setShowFinishDialog}
          onFinish={handleFinishTest}
          answeredCount={answeredCount}
          totalQuestions={totalQuestions}
          flaggedCount={flaggedCount}
          finishing={finishing}
        />
      )}
    </div>
  );
}
