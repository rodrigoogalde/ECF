import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ChevronRight, FileText } from 'lucide-react';
import { getDocsNavigation } from '@/lib/mdx';

export default function DocsPage() {
  const navigation = getDocsNavigation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-10 space-y-4 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
            <FileText className="h-3 w-3" />
            Material de estudio
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Apuntes y Explicaciones
          </h1>
          <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-400">
            Explora el material de estudio organizado por módulos y cursos. Cada sección incluye
            explicaciones teóricas, ejemplos resueltos y ejercicios para practicar.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {navigation.sections.map((section: { code: string; name: string; courses: { code: string; name: string; slug: string }[] }) => (
            <Card
              key={section.code}
              className="border-slate-200/80 bg-white/80 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/80 hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <Badge variant="outline" className="text-xs mb-1">
                      {section.code}
                    </Badge>
                    <CardTitle className="text-base font-semibold leading-tight text-slate-900 dark:text-white">
                      {section.name.replace(`${section.code}: `, '').replace('Módulo 1: ', '').replace('Módulo 2: ', '').replace('Módulo 3: ', '')}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-1">
                  {section.courses.map((course: { code: string; name: string; slug: string }) => (
                    <Link
                      key={course.code}
                      href={`/docs/${section.code}/${course.slug}`}
                      className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                          {course.code}
                        </span>
                        <span>{course.name}</span>
                      </span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
