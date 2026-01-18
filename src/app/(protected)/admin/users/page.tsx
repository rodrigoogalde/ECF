import { getAllUsers } from "@/app/actions/routes/user"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ROUTES } from "@/lib/config/routes"

export default async function UsersPage() {
  const users = await getAllUsers()

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Panel de Usuarios</h1>
          <p className="text-muted-foreground mt-1">
            Aquí puedes ver, editar y crear nuevos usuarios.
          </p>
        </div>
        <Link href={ROUTES.ADMIN.USERS.CREATE}>
          <Button>Crear nuevo usuario</Button>
        </Link>
      </div>
      
      <DataTable columns={columns} data={users} />
    </div>
  )
}
