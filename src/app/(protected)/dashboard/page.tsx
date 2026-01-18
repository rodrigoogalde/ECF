import { auth } from "@/src/lib/auth";
import { UserProfile } from "@/src/components/UserProfile";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Esta es una página protegida. Solo usuarios autenticados pueden verla.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Información del Usuario</h2>
          <div className="space-y-2">
            <p><strong>Nombre:</strong> {session?.user?.name || "No disponible"}</p>
            <p><strong>Email:</strong> {session?.user?.email}</p>
            {session?.user?.image && (
              <p><strong>Imagen:</strong> <img src={session.user.image} alt="Avatar" className="w-10 h-10 rounded-full inline-block ml-2" /></p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Componente Cliente</h2>
          <p className="text-gray-600 mb-4">
            Este componente usa el hook useSession() del lado del cliente:
          </p>
          <UserProfile />
        </div>
      </div>
    </div>
  );
}
