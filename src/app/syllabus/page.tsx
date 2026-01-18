import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ChevronRight, Layers3, ListChecks } from "lucide-react";
import syllabus from "../../../data/syllabus.json";
import { Navbar } from "@/components/Navbar";


interface IndicadorCurso {
  topic: string;
  course: string;
  contents: string[];
  indicators: string[];
}

interface Modulo {
  name: string;
  courses: IndicadorCurso[];
}

interface SyllabusData {
  modules: Modulo[];
}

const data = syllabus as SyllabusData;

export default function SyllabusPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-10 space-y-4 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
            <ListChecks className="h-3 w-3" />
            Syllabus oficial ECF
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Syllabus del Examen Fundamentals
          </h1>
          <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-400">
            Explora los módulos, courses y contenidos que forman parte del Examen de Competencias
            Fundamentales. Usa esta página como mapa para planificar tu estudio y conectar los
            recourses de problemas tipo y resúmenes con los indicadores de aprendizaje.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[260px,1fr]">
          {/* Índice lateral */}
          <aside className="hidden space-y-3 lg:block">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Layers3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  Módulos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {data.modules.map((modulo) => (
                  <a
                    key={modulo.name}
                    href={`#${encodeURIComponent(modulo.name)}`}
                    className="flex items-center justify-between rounded-md px-2 py-1 text-left text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                  >
                    <span className="line-clamp-2">{modulo.name}</span>
                    <ChevronRight className="h-3 w-3" />
                  </a>
                ))}
              </CardContent>
            </Card>
          </aside>

          {/* Contenido principal */}
          <section className="space-y-8">
            {data.modules.map((modulo) => (
              <Card
                key={modulo.name}
                id={encodeURIComponent(modulo.name)}
                className="border-slate-200/80 bg-white/80 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/80"
              >
                <CardHeader className="border-b border-slate-100 pb-4 dark:border-slate-800">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-semibold leading-tight text-slate-900 dark:text-white">
                          {modulo.name}
                        </CardTitle>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {modulo.courses.length} courses asociados
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Módulo
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  <div className="px-4 py-4 space-y-4">
                    {modulo.courses.map((curso) => (
                      <div
                        key={`${curso.course}-${curso.topic}`}
                        className="rounded-lg border border-slate-100 bg-slate-50/60 p-4 text-sm dark:border-slate-800 dark:bg-slate-900/80"
                      >
                        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                              {curso.course}
                            </p>
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                              {curso.topic}
                            </h3>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-col gap-3 md:flex-row">
                          <div className="md:w-1/3">
                            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                              Contenidos
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {curso.contents.map((contenido) => (
                                <Badge
                                  key={contenido}
                                  title={contenido}
                                  variant="secondary"
                                  className="max-w-full justify-start truncate bg-slate-100 text-[11px] text-slate-800 dark:bg-slate-800 dark:text-slate-100"
                                >
                                  {contenido}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="md:w-2/3">
                            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                              Indicadores de logro
                            </p>
                            <ul className="space-y-1 text-[13px] leading-relaxed text-slate-700 dark:text-slate-300">
                              {curso.indicators.map((indicador) => (
                                <li key={indicador} className="flex gap-2">
                                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                                  <span>{indicador}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}
