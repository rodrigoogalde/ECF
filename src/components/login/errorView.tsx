'use client'

import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { ROUTES } from "@/lib/config/routes";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ErrorViewProps {
  title: string;
  description: string;
  error?: string;
  className?: string;
}

export function ErrorView({
  title,
  description,
  error,
  className,
}: ErrorViewProps) {
  return (
    <Card className={cn("w-full max-w-md shadow-md rounded-xl p-6 relative", className)}>
        <Link
          href={ROUTES.HOME}
          className="absolute top-4 left-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          <span className="font-medium">Inicio</span>
        </Link>

        <CardHeader className="text-center pt-8">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-amber-50 dark:bg-amber-900/30 p-3">
              <AlertTriangle className="h-12 w-12 text-amber-500 dark:text-amber-400" />
            </div>
          </div>
          
          <CardTitle className="text-3xl font-bold">
            {title}
          </CardTitle>
          <CardDescription className="text-sm mt-2">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-3 py-4">
          <Link href={ROUTES.LOGIN}>
            <Button
              className="w-full flex items-center justify-center gap-2 rounded-md"
            >
              Intentar nuevamente
            </Button>
          </Link>

          {error === "UnauthorizedEmail" && (
            <div className="mt-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Nota:</strong> Debes usar tu correo institucional UC (ejemplo: tunombre@uc.cl) para acceder a esta plataforma.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
  )
}