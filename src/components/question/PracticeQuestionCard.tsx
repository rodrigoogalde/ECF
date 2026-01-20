"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MathRenderer } from "@/components/MathRenderer";
import { Flag } from "lucide-react";

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
  options: Option[];
  correctLabel: string | null;
}

interface PracticeQuestionCardProps {
  question: Question;
  selectedOptionId: number | null;
  flagged: boolean;
  onSelectOption: (optionId: number | null) => void;
  onToggleFlag: () => void;
}

export function PracticeQuestionCard({
  question,
  selectedOptionId,
  flagged,
  onSelectOption,
}: PracticeQuestionCardProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg">{question.title}</CardTitle>
            <Badge variant="secondary">{question.uniqueCode}</Badge>
          </div>
          {flagged && (
            <Badge variant="outline" className="border-orange-500 text-orange-500">
              <Flag className="h-3 w-3 mr-1" />
              Marcada
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
            
            return (
              <button
                key={option.id}
                onClick={() => onSelectOption(isSelected ? null : option.id)}
                className={`
                  w-full p-4 rounded-lg border text-left transition-all
                  ${isSelected 
                    ? "bg-primary/10 border-primary ring-2 ring-primary" 
                    : "bg-muted/50 hover:bg-muted border-transparent hover:border-muted-foreground/20"}
                `}
              >
                <div className="flex items-start gap-3">
                  <span className={`
                    flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm
                    ${isSelected 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted-foreground/20"}
                  `}>
                    {option.label}
                  </span>
                  <div className="flex-1 pt-1">
                    <MathRenderer content={option.text} inline />
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
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
