"use client";

import Link from "next/link";
import { useSession, signOut } from "@/src/lib/auth-client";
import { Button } from "@components/button";

export function Navbar() {
  const { data: session, status } = useSession();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link href="/main" className="text-xl font-bold text-gray-900">
              Mi App
            </Link>
            
            {session && (
              <div className="flex gap-4">
                <Link 
                  href="/main" 
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Inicio
                </Link>
                <Link 
                  href="/dashboard" 
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {status === "loading" ? (
              <div className="text-sm text-gray-500">Cargando...</div>
            ) : session ? (
              <>
                <span className="text-sm text-gray-700">
                  {session.user?.name || session.user?.email}
                </span>
                <Button onClick={handleSignOut} variant="outline" size="sm">
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Iniciar sesión
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
