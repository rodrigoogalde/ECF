import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getTestWithQuestions } from '@/app/actions/routes/test';
import { ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/lib/config/routes';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

async function TestDetailLoader({ testId }: { testId: string }) {
  const test = await getTestWithQuestions(testId);

  if (!test) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información del Test</CardTitle>
          <CardDescription>Detalles generales</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <span className="font-semibold">Nombre:</span> {test.name}
            </div>
            <div>
              <span className="font-semibold">Total de preguntas:</span> {test.questions?.length || 0}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preguntas del Test</CardTitle>
          <CardDescription>
            {test.questions?.length || 0} pregunta(s) en este test
          </CardDescription>
        </CardHeader>
        <CardContent>
          {test.questions && test.questions.length > 0 ? (
            <div className="space-y-3">
              {test.questions.map((question: any, index: number) => (
                <div
                  key={question.id}
                  className="p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-medium">
                      {index + 1}. {question.uniqueCode}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {question.courseCode}
                      </span>
                      <span className="text-xs bg-secondary px-2 py-1 rounded">
                        {question.period}
                      </span>
                      <span className="text-xs bg-muted px-2 py-1 rounded">
                        {question.type}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {question.title}
                  </div>
                  <div className="text-sm line-clamp-2">
                    {question.content}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              Este test no tiene preguntas asignadas
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default async function TestDetailPage({ params }: PageProps) {
  const { id } = await params;
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <Link href={ROUTES.ADMIN.TESTS.LIST}>
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Tests
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-2">Detalle del Test</h1>
        <p className="text-muted-foreground">
          Visualiza las preguntas y detalles del test
        </p>
      </div>

      <Suspense
        fallback={
          <div className="text-center py-12 text-muted-foreground">
            Cargando detalles del test...
          </div>
        }
      >
        <TestDetailLoader testId={id} />
      </Suspense>
    </div>
  );
}
