import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { ROUTES } from "@/lib/config/routes";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="mx-4 max-w-md rounded-2xl bg-white p-8 text-center shadow-xl dark:bg-slate-800">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/30">
            <ShieldAlert className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
        </div>
        
        <h1 className="mb-3 text-3xl font-bold text-slate-900 dark:text-white">
          Acceso Denegado
        </h1>
        
        <p className="mb-6 text-slate-600 dark:text-slate-300">
          No tienes permisos para acceder a esta página. Si crees que esto es un error, 
          contacta al administrador.
        </p>
        
        <Link
          href={ROUTES.HOME}
          className="inline-block rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
