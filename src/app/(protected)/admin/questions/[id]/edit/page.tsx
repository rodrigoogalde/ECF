"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/config/routes";
import { ArrowLeft } from "lucide-react";
import { QuestionForm } from "@/components/question/QuestionForm";
import { getQuestionById } from "@/app/actions/routes/question";
import { toast } from "sonner";
import { Prisma } from "@prisma/client";

export default function EditQuestionPage() {
  const router = useRouter();
  const params = useParams();
  const questionId = params.id as string;

  const [loadingData, setLoadingData] = useState(true);
  const [question, setQuestion] = useState<Prisma.QuestionGetPayload<{
    include: {
      options: true;
      course: true;
    };
  }> | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const questionData = await getQuestionById(questionId);
        setQuestion(questionData as any);
      } catch (error) {
        console.error("Error loading question:", error);
        toast.error("Error al cargar la pregunta");
        router.push(ROUTES.ADMIN.QUESTIONS.LIST);
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, [questionId, router]);


  if (loadingData) {
    return (
      <div className="container mx-auto py-8 px-4">
        <p>Cargando pregunta...</p>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="container mx-auto py-8 px-4">
        <p>Pregunta no encontrada</p>
      </div>
    );
  }

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
        <h1 className="text-3xl font-bold">Editar Pregunta</h1>
      </div>

      <QuestionForm question={question} />
    </div>
  );
}
