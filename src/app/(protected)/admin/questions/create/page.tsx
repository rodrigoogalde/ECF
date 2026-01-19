"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/config/routes";
import { ArrowLeft } from "lucide-react";
import { QuestionForm } from "@/components/question/QuestionForm";

export default function CreateQuestionPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push(ROUTES.ADMIN.QUESTIONS.LIST)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <h1 className="text-3xl font-bold">Crear Nueva Pregunta</h1>
      </div>

      <QuestionForm />
    </div>
  );
}
