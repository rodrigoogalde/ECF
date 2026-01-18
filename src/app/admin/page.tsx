import { requireAdmin } from "@/lib/utils/auth-utils";
import { Shield } from "lucide-react";

export default async function AdminPage() {
  const session = await requireAdmin();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900/30">
          <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Panel de Administrador
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Bienvenido, {session.user.name}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">
            Gestión de Usuarios
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Administra usuarios y sus roles
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">
            Configuración
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Ajustes del sistema
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">
            Reportes
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Estadísticas y análisis
          </p>
        </div>
      </div>
    </div>
  );
}
