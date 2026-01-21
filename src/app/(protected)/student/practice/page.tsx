"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, BookOpen, Clock, Users, History } from "lucide-react";
import { getAllTests } from "@/app/actions/routes/test";
import { startTestAttempt } from "@/app/actions/routes/testAttempt";
import { useSession } from "next-auth/react";
import { ROUTES } from "@/lib/config/routes";
import Link from "next/link";

interface TestWithCount {
  id: string;
  name: string;
  _count?: {
    questions: number;
    attempts: number;
  };
}

export default function PracticePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [tests, setTests] = useState<TestWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [startingTest, setStartingTest] = useState<string | null>(null);

  useEffect(() => {
    async function loadTests() {
      try {
        const data = await getAllTests();
        setTests(data as TestWithCount[]);
      } catch (error) {
        console.error("Error loading tests:", error);
      } finally {
        setLoading(false);
      }
    }
    loadTests();
  }, []);

  const handleStartTest = async (testId: string) => {
    if (!session?.user?.id) return;
    
    setStartingTest(testId);
    try {
      const attempt = await startTestAttempt(session.user.id, testId);
      router.push(ROUTES.STUDENT.PRACTICE.DETAIL(attempt.id));
    } catch (error) {
      console.error("Error starting test:", error);
      setStartingTest(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pruebas de Práctica</h1>
          <p className="text-muted-foreground mt-2">
            Selecciona una prueba para comenzar a practicar
          </p>
        </div>
        <Link href={ROUTES.STUDENT.PRACTICE.ATTEMPTS}>
          <Button variant="outline">
            <History className="h-4 w-4 mr-2" />
            Ver Mis Intentos
          </Button>
        </Link>
      </div>

      {tests.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">
              No hay pruebas disponibles en este momento
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tests.map((test) => (
            <Card 
              key={test.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {test.name}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Prueba de práctica
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">
                    <BookOpen className="h-3 w-3 mr-1" />
                    {test._count?.questions || 0}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>~{(test._count?.questions || 0) * 2} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{test._count?.attempts || 0} intentos</span>
                  </div>
                </div>
                <Button 
                  className="w-full"
                  onClick={() => handleStartTest(test.id)}
                  disabled={startingTest === test.id}
                >
                  {startingTest === test.id ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Iniciando...
                    </>
                  ) : (
                    "Comenzar Prueba"
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
