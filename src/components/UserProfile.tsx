"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@components/ui/button";

export function UserProfile() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Cargando sesión...</div>;
  }

  if (!session) {
    return <div>No hay sesión activa</div>;
  }

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex items-center gap-4">
      <div>
        <p className="font-medium">{session.user?.name || "Usuario"}</p>
        <p className="text-sm text-gray-500">{session.user?.email}</p>
      </div>
      <Button onClick={handleSignOut} variant="outline">
        Cerrar sesión
      </Button>
    </div>
  );
}
