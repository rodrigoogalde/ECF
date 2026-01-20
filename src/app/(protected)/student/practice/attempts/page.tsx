import { getUserAttempts } from "@/app/actions/routes/testAttempt"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ROUTES } from "@/lib/config/routes"

export default async function AttemptsPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect(ROUTES.LOGIN)
  }

  const attempts = await getUserAttempts(session.user.id)

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Mis Intentos de Tests</h1>
        <p className="text-muted-foreground mt-1">
          Aquí puedes ver el historial de todos tus intentos de tests.
        </p>
      </div>
      
      <DataTable columns={columns} data={attempts} />
    </div>
  )
}
