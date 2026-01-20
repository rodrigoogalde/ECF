"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MathRenderer } from "@/components/MathRenderer";
import { CheckCircle, XCircle } from "lucide-react";

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

interface ReviewQuestionCardProps {
  question: Question;
  selectedOptionId: number | null;
  isCorrect: boolean | null;
}

export function ReviewQuestionCard({
  question,
  selectedOptionId,
  isCorrect,
}: ReviewQuestionCardProps) {
  const selectedOption = question.options.find(opt => opt.id === selectedOptionId);
  const correctOption = question.options.find(opt => opt.label === question.correctLabel);

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg">{question.title}</CardTitle>
            <Badge variant="secondary">{question.uniqueCode}</Badge>
          </div>
          {isCorrect !== null && (
            <Badge 
              variant={isCorrect ? "default" : "destructive"}
              className={isCorrect ? "bg-green-500 hover:bg-green-600" : ""}
            >
              {isCorrect ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Correcta
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-1" />
                  Incorrecta
                </>
              )}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <MathRenderer content={question.content} />
        </div>

        {question.imageUrl && question.imageUrl.length > 0 && (
          <div className="my-4 flex justify-center">
            <div className="relative w-full max-w-3xl">
              <Image
                src={question.imageUrl[0]}
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
            const isSelected = selectedOptionId === option.id;
            const isCorrectOption = option.label === question.correctLabel;
            
            let borderColor = "border-transparent";
            let bgColor = "bg-muted/50";
            let ringClass = "";
            
            if (isCorrectOption) {
              borderColor = "border-green-500";
              bgColor = "bg-green-50 dark:bg-green-950/20";
              ringClass = "ring-2 ring-green-500";
            } else if (isSelected && !isCorrect) {
              borderColor = "border-red-500";
              bgColor = "bg-red-50 dark:bg-red-950/20";
              ringClass = "ring-2 ring-red-500";
            }
            
            return (
              <div
                key={option.id}
                className={`
                  w-full p-4 rounded-lg border transition-all
                  ${bgColor} ${borderColor} ${ringClass}
                `}
              >
                <div className="flex items-start gap-3">
                  <span className={`
                    flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm
                    ${isCorrectOption 
                      ? "bg-green-500 text-white" 
                      : isSelected && !isCorrect
                        ? "bg-red-500 text-white"
                        : "bg-muted-foreground/20"}
                  `}>
                    {option.label}
                  </span>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-2">
                      <MathRenderer content={option.text} inline />
                      {isCorrectOption && (
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      )}
                      {isSelected && !isCorrect && (
                        <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                      )}
                    </div>
                    {option.imageUrl && option.imageUrl.length > 0 && (
                      <div className="mt-2">
                        <Image
                          src={option.imageUrl[0]}
                          alt={`Opción ${option.label}`}
                          width={400}
                          height={300}
                          className="rounded border max-h-[200px] object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {!selectedOptionId && (
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              No respondiste esta pregunta
            </p>
          </div>
        )}

        {question.solution && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
              <span className="text-lg">💡</span>
              Explicación
            </h4>
            <div className="prose prose-sm max-w-none dark:prose-invert text-blue-900 dark:text-blue-100">
              <MathRenderer content={question.solution} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
