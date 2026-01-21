"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { GraduationCap } from "lucide-react";
import { ROUTES } from "@/lib/config/routes";
import { LoginButton } from "@/components/login/loginButton";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={ROUTES.HOME} className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <span className="text-xl font-bold text-slate-900 dark:text-white">ECF</span>
        </Link>
        {session && (
          <nav className="hidden items-center gap-6 md:flex">
            <Link href={ROUTES.STUDENT.PRACTICE.LIST} className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
              Problemas
            </Link>
            <Link href={ROUTES.SUMMARY.LIST} className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
              Resúmenes
            </Link>
            <Link href={ROUTES.SYLLABUS} className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
              Temario
            </Link>
            <Link href="#" className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
              Foros
            </Link>
          </nav>
        )}
      

        <div className="flex items-center gap-4">
          <LoginButton />
        </div>

      </div>
    </header>
  );
}
