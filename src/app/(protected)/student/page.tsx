import { auth } from "@/lib/auth";
import { BookOpen } from "lucide-react";

export default async function StudentPage() {
  const session = await auth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
          <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Portal del Estudiante
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Bienvenido, {session?.user.name}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">
            Mis Cursos
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Accede a tus cursos y materiales
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">
            Evaluaciones
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Revisa tus calificaciones
          </p>
        </div>
      </div>
    </div>
  );
}
