import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllTests } from '@/app/actions/routes/test';
import { Plus } from 'lucide-react';
import { ROUTES } from '@/lib/config/routes';

async function TestsListLoader() {
  const tests = await getAllTests();

  return (
    <div className="space-y-4">
      {tests.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p>No hay tests creados aún</p>
            <p className="text-sm mt-2">Crea tu primer test usando el botón de arriba</p>
          </CardContent>
        </Card>
      ) : (
        tests.map((test: any) => (
          <Card key={test.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{test.name}</CardTitle>
                  <CardDescription>
                    {test._count?.questions || 0} pregunta(s) · {test._count?.attempts || 0} intento(s)
                  </CardDescription>
                </div>
                <Link href={ROUTES.ADMIN.TESTS.DETAIL(test.id)}>
                  <Button variant="outline" size="sm">
                    Ver Detalles
                  </Button>
                </Link>
              </div>
            </CardHeader>
          </Card>
        ))
      )}
    </div>
  );
}

export default function TestsPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestión de Tests</h1>
          <p className="text-muted-foreground">
            Administra los tests y crea nuevos usando filtros
          </p>
        </div>
        <Link href={ROUTES.ADMIN.TESTS.CREATE}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Crear Test
          </Button>
        </Link>
      </div>

      <Suspense
        fallback={
          <div className="text-center py-12 text-muted-foreground">
            Cargando tests...
          </div>
        }
      >
        <TestsListLoader />
      </Suspense>
    </div>
  );
}
