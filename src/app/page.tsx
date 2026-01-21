import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";

import {
  BookOpen,
  FileText,
  MessageSquare,
  ClipboardList,
  Tags,
  GraduationCap,
  ArrowRight,
  Users,
  Target,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Navbar } from "@components/Navbar";
import { ROUTES } from "@/lib/config/routes";

const features = [
  {
    icon: BookOpen,
    title: "Problemas Tipo",
    description: "Ejercicios representativos de cada materia con soluciones detalladas en formato LaTeX/Markdown.",
    href: ROUTES.STUDENT.PRACTICE.LIST,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    icon: FileText,
    title: "Resúmenes y Compilados",
    description: "Material de estudio condensado y organizado por materia para optimizar tu preparación.",
    href: ROUTES.DOCS.LIST,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  {
    icon: ClipboardList,
    title: "Syllabus",
    description: "Mapa completo de módulos, cursos, contenidos e indicadores del examen Fundamentals.",
    href: ROUTES.SYLLABUS,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
  },
  {
    icon: MessageSquare,
    title: "Foros de Discusión",
    description: "Espacio colaborativo para resolver dudas y compartir conocimiento con otros estudiantes.",
    href: ROUTES.MAIN,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
  },
  {
    icon: Tags,
    title: "Tópicos por Pregunta",
    description: "Clasificación detallada de preguntas por tema para un estudio más enfocado.",
    href: ROUTES.MAIN,
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-100 dark:bg-rose-900/30",
  },
];

const stats = [
  { value: "12", label: "Materias", icon: BookOpen },
  { value: "500+", label: "Problemas", icon: Target },
  { value: "50+", label: "Resúmenes", icon: FileText },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-32 lg:px-8">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/5" />
        </div>
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-4">
            <Lightbulb className="mr-1 h-3 w-3" />
            Plataforma de estudio colaborativo
          </Badge>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Cracking
            </span>
            {" "}the{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Fundamentals
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            ECF es una plataforma diseñada para ayudar a los estudiantes de ingeniería a prepararse 
            para el Examen de Competencias Fundamentales. Accede a problemas tipo, resúmenes, 
            temarios y colabora con otros estudiantes.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="gap-2">
              <Link href={ROUTES.DOCS.LIST}>
                Explorar Materias
              </Link>
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={ROUTES.SYLLABUS}>
                  Ver Temario
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-slate-200 bg-slate-50 px-4 py-12 dark:border-slate-800 dark:bg-slate-900/50 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-4xl grid-cols-3 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="mb-2 flex justify-center">
                <stat.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">
              Todo lo que necesitas para aprobar
            </h2>
            <p className="mx-auto max-w-2xl text-slate-600 dark:text-slate-400">
              Recursos organizados y herramientas colaborativas para maximizar tu preparación.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="group relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <CardHeader>
                  <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg ${feature.bgColor}`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link
                    href={feature.href}
                    className={`inline-flex items-center gap-1 text-sm font-medium ${feature.color} transition-all group-hover:gap-2`}
                  >
                    Explorar
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Card className="overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
            <CardContent className="flex flex-col items-center gap-6 p-8 text-center sm:p-12">
              <Users className="h-12 w-12 opacity-90" />
              <h2 className="text-2xl font-bold sm:text-3xl">
                Únete a la comunidad de estudio
              </h2>
              <p className="max-w-xl text-blue-100">
                Colabora con otros estudiantes, comparte recursos y resuelve dudas juntos. 
                El aprendizaje colaborativo es la clave del éxito.
              </p>
              <Link href={ROUTES.MAIN}>
                <Button size="lg" variant="secondary" className="gap-2">
                  Acceder a los Foros
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 px-4 py-12 dark:border-slate-800 dark:bg-slate-900/50 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <span className="font-bold text-slate-900 dark:text-white">ECF</span>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                - Estudio Colaborativo Fundamentals
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Hecho con ❤️ por estudiantes, para estudiantes
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
