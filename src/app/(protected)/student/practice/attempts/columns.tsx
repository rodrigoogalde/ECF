"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import Link from "next/link"
import { ROUTES } from "@/lib/config/routes"

export type TestAttemptWithDetails = {
  id: string
  startedAt: Date
  finishedAt: Date | null
  score: number | null
  status: string
  test: {
    id: string
    name: string
  }
  _count?: {
    responses: number
  }
}

export const columns: ColumnDef<TestAttemptWithDetails>[] = [
  {
    accessorKey: "test.name",
    header: "Test",
    cell: ({ row }) => {
      return <div className="font-medium">{row.original.test.name}</div>
    },
  },
  {
    accessorKey: "startedAt",
    header: "Fecha de Inicio",
    cell: ({ row }) => {
      const date = new Date(row.getValue("startedAt"))
      return (
        <div>
          <div>{date.toLocaleDateString("es-CL")}</div>
          <div className="text-xs text-muted-foreground">
            {date.toLocaleTimeString("es-CL", { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "finishedAt",
    header: "Fecha de Término",
    cell: ({ row }) => {
      const date = row.getValue("finishedAt") as Date | null
      if (!date) {
        return <div className="text-muted-foreground">En progreso</div>
      }
      const finishedDate = new Date(date)
      return (
        <div>
          <div>{finishedDate.toLocaleDateString("es-CL")}</div>
          <div className="text-xs text-muted-foreground">
            {finishedDate.toLocaleTimeString("es-CL", { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
        IN_PROGRESS: { label: "En Progreso", variant: "secondary" },
        COMPLETED: { label: "Completado", variant: "default" },
        ABANDONED: { label: "Abandonado", variant: "destructive" },
      }
      const statusInfo = statusMap[status] || { label: status, variant: "outline" }
      return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
    },
  },
  {
    accessorKey: "score",
    header: "Puntaje",
    cell: ({ row }) => {
      const score = row.getValue("score") as number | null
      if (score === null) {
        return <div className="text-muted-foreground">-</div>
      }
      return <div className="font-medium">{score.toFixed(1)}%</div>
    },
  },
  {
    accessorKey: "_count.responses",
    header: "Respuestas",
    cell: ({ row }) => {
      const count = row.original._count?.responses || 0
      return <div>{count}</div>
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const attempt = row.original
      return (
        <div className="flex gap-2">
          {attempt.status === "IN_PROGRESS" ? (
            <Link href={ROUTES.STUDENT.PRACTICE.DETAIL(attempt.id)}>
              <Button variant="outline" size="sm">
                Continuar
              </Button>
            </Link>
          ) : (
            <Link href={ROUTES.STUDENT.PRACTICE.DETAIL(attempt.id)}>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Ver Detalles
              </Button>
            </Link>
          )}
        </div>
      )
    },
  },
]
