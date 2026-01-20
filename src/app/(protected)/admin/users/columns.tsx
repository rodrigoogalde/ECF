"use client"

import { ColumnDef } from "@tanstack/react-table"
import { User } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => {
      return <div>{row.getValue("name") || "Sin nombre"}</div>
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Perfiles",
    cell: ({ row }) => {
      const role = row.getValue("role") as string
      const roleMap: Record<string, string> = {
        ADMIN: "Administrador",
        STUDENT: "Estudiante",
      }
      return <div>{roleMap[role] || role}</div>
    },
  },
  {
    accessorKey: "createdAt",
    header: "Fecha de Creación",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return <div>{date.toLocaleDateString("es-CL")}</div>
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  },
]
