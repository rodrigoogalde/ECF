"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { CircleUser, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { ROUTES } from "@/lib/config/routes";
import { logout } from "@/app/actions/auth";

export function LoginButton() {
  const { data: session, status } = useSession();
  const [isHovered, setIsHovered] = useState(false);

  const handleSignOut = async () => {
    await logout();
  };

  if (status === "loading") {
    return <div className="text-sm text-gray-500">Cargando...</div>;
  }

  if (session) {
    return (
      <div className="relative group">
        <motion.button
          onClick={handleSignOut}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative flex items-center gap-3 rounded-full px-3 py-1.5 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
          whileTap={{ scale: 0.98 }}
        >
          <div className="relative h-9 w-9 flex-shrink-0">
            <motion.div
              className="absolute inset-0 overflow-hidden rounded-full"
              animate={{ opacity: isHovered ? 0 : 1 }}
              transition={{ duration: 0.2 }}
            >
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "Usuario"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-blue-600 text-white">
                  <span className="text-base font-semibold">
                    {(session.user?.name?.[0] || session.user?.email?.[0] || "U").toUpperCase()}
                  </span>
                </div>
              )}
            </motion.div>
            <motion.div
              className="absolute inset-0 flex items-center justify-center rounded-full bg-red-50 dark:bg-red-950"
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <LogOut className="h-5 w-5 text-red-600 dark:text-red-400" />
            </motion.div>
          </div>
          <span className="hidden text-sm font-medium text-slate-700 dark:text-slate-300 md:block">
            {session.user?.name?.split(" ")[0] || session.user?.email?.split("@")[0]}
          </span>
        </motion.button>
        <motion.div
          className="absolute right-0 top-full mt-2 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white shadow-lg dark:bg-slate-100 dark:text-slate-900"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : -10 }}
          transition={{ duration: 0.2 }}
          style={{ pointerEvents: "none" }}
        >
          Cerrar sesión
          <div className="absolute -top-1 right-4 h-2 w-2 rotate-45 bg-slate-900 dark:bg-slate-100" />
        </motion.div>
      </div>
    );
  }

  return (
    <Link href={ROUTES.LOGIN}>
      <motion.div
        className="flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <CircleUser className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Iniciar sesión
        </span>
      </motion.div>
    </Link>
  );
}
