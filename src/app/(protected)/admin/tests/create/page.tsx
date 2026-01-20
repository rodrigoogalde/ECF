'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ROUTES } from '@/lib/config/routes';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getFilteredQuestionsForTest, createTestFromFilters, getTestCreationFilters, TestFilters } from '@/app/actions/routes/admin';
import { Loader2 } from 'lucide-react';

interface Question {
  id: string;
  uniqueCode: string;
  title: string;
  content: string;
  period: string;
  type: string;
  courseCode: string;
}

export default function CreateTestPage() {
  const router = useRouter();
  const [testName, setTestName] = useState('');
  const [filters, setFilters] = useState<TestFilters>({});
  const [availableFilters, setAvailableFilters] = useState({
    sections: [] as string[],
    courses: [] as string[],
    types: [] as string[],
    periods: [] as string[],
  });
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [isLoadingFilters, setIsLoadingFilters] = useState(true);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAvailableFilters();
  }, []);

  const loadAvailableFilters = async () => {
    try {
      const filters = await getTestCreationFilters();
      setAvailableFilters(filters);
    } catch (err) {
      setError('Error al cargar los filtros disponibles');
      console.error(err);
    } finally {
      setIsLoadingFilters(false);
    }
  };

  const handleFilterChange = (key: keyof TestFilters, value: string) => {
    const newFilters = { ...filters };
    if (value === 'all') {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    setFilters(newFilters);
  };

  const handlePreviewQuestions = async () => {
    setIsLoadingQuestions(true);
    setError('');
    try {
      const questions = await getFilteredQuestionsForTest(filters);
      setFilteredQuestions(questions);
      if (questions.length === 0) {
        setError('No se encontraron preguntas con los filtros seleccionados');
      }
    } catch (err) {
      setError('Error al cargar las preguntas');
      console.error(err);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const handleCreateTest = async () => {
    if (!testName.trim()) {
      setError('Por favor ingresa un nombre para el test');
      return;
    }

    if (filteredQuestions.length === 0) {
      setError('Primero debes previsualizar las preguntas');
      return;
    }

    setIsCreating(true);
    setError('');
    try {
      await createTestFromFilters(testName, filters);
      router.push(ROUTES.ADMIN.TESTS.LIST);
    } catch (err: any) {
      setError(err.message || 'Error al crear el test');
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoadingFilters) {
    return (
      <div className="container mx-auto py-8 px-4 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Crear Nuevo Test</h1>
        <p className="text-muted-foreground">
          Utiliza los filtros para seleccionar las preguntas que formarán parte del test
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del Test</CardTitle>
              <CardDescription>Nombre y configuración básica</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="testName">Nombre del Test</Label>
                <Input
                  id="testName"
                  placeholder="Ej: Test de Matemáticas 24-2"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Filtros de Preguntas</CardTitle>
              <CardDescription>Selecciona los criterios para filtrar preguntas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="period">Período</Label>
                <Select
                  value={filters.period || 'all'}
                  onValueChange={(value) => handleFilterChange('period', value)}
                >
                  <SelectTrigger id="period">
                    <SelectValue placeholder="Todos los períodos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los períodos</SelectItem>
                    {availableFilters.periods.map((period) => (
                      <SelectItem key={period} value={period}>
                        {period}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="section">Sección</Label>
                <Select
                  value={filters.sectionCode || 'all'}
                  onValueChange={(value) => handleFilterChange('sectionCode', value)}
                >
                  <SelectTrigger id="section">
                    <SelectValue placeholder="Todas las secciones" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las secciones</SelectItem>
                    {availableFilters.sections.map((section) => (
                      <SelectItem key={section} value={section}>
                        {section}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="course">Curso</Label>
                <Select
                  value={filters.courseCode || 'all'}
                  onValueChange={(value) => handleFilterChange('courseCode', value)}
                >
                  <SelectTrigger id="course">
                    <SelectValue placeholder="Todos los cursos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los cursos</SelectItem>
                    {availableFilters.courses.map((course) => (
                      <SelectItem key={course} value={course}>
                        {course}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <Select
                  value={filters.type || 'all'}
                  onValueChange={(value) => handleFilterChange('type', value)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    {availableFilters.types.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handlePreviewQuestions}
                disabled={isLoadingQuestions}
                className="w-full"
              >
                {isLoadingQuestions ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cargando...
                  </>
                ) : (
                  'Previsualizar Preguntas'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Preguntas Seleccionadas</CardTitle>
              <CardDescription>
                {filteredQuestions.length > 0
                  ? `${filteredQuestions.length} pregunta(s) encontrada(s)`
                  : 'Usa los filtros y previsualiza para ver las preguntas'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredQuestions.length > 0 ? (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {filteredQuestions.map((question) => (
                    <div
                      key={question.id}
                      className="p-3 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="font-medium text-sm mb-1">{question.uniqueCode}</div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {question.title}
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
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-12">
                  <p>No hay preguntas para mostrar</p>
                  <p className="text-sm mt-2">
                    Selecciona filtros y haz clic en &quot;Previsualizar Preguntas&quot;
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-destructive/10 text-destructive rounded-lg">
          {error}
        </div>
      )}

      <div className="mt-6 flex gap-4 justify-end">
        <Button variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button
          onClick={handleCreateTest}
          disabled={isCreating || filteredQuestions.length === 0 || !testName.trim()}
        >
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creando...
            </>
          ) : (
            'Crear Test'
          )}
        </Button>
      </div>
    </div>
  );
}
