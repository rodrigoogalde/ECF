"use client";

import { Card, CardContent} from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { 
  Activity, 
  ChevronRight, 
  FileText, 
  BookOpen, 
  PlusCircle, 
  GraduationCap, 
  TrendingUp, 
  Users,
  AlertCircle,
  Target
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Session } from "next-auth";
import { ROLE } from "@/lib/constants/roles";

interface MainDashboardProps {
  user: Session["user"];
}

export function MainDashboard({ user }: MainDashboardProps) {
  const isAdmin = user.role === ROLE.ADMIN;
  const isStudent = user.role === ROLE.STUDENT;

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 p-8 border border-blue-100 dark:border-blue-900"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                ¡Bienvenido a ECF - Break the test!
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Tu plataforma de estudio para el Examen de Competencias Fundamentales
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tu Rol</p>
                <div className="flex gap-1 mt-1">
                  {isStudent && (
                    <Badge variant="secondary" className="text-xs">
                      Estudiante
                    </Badge>
                  )}
                  {isAdmin && (
                    <Badge variant="default" className="text-xs">
                      Administrador
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Usuario</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{user.name || user.email}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 translate-y-12 -translate-x-12"></div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Acciones Rápidas
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(isStudent || isAdmin) && (
            <>
              <QuickActionCard
                title="Practicar"
                description="Resolver preguntas del ECF"
                icon={<PlusCircle className="w-6 h-6" />}
                href="/student/practice"
                color="blue"
              />
              <QuickActionCard
                title="Mis Resultados"
                description="Ver mi historial de práctica"
                icon={<FileText className="w-6 h-6" />}
                href="/student/results"
                color="green"
              />
              <QuickActionCard
                title="Progreso"
                description="Ver mi progreso y estadísticas"
                icon={<TrendingUp className="w-6 h-6" />}
                href="/student/progress"
                color="purple"
              />
            </>
          )}
          
          {isAdmin && (
            <>
              <QuickActionCard
                title="Gestionar Preguntas"
                description="Administrar banco de preguntas"
                icon={<FileText className="w-6 h-6" />}
                href="/admin/questions"
                color="orange"
              />
              <QuickActionCard
                title="Usuarios"
                description="Gestionar usuarios del sistema"
                icon={<Users className="w-6 h-6" />}
                href="/admin/users"
                color="red"
              />
              <QuickActionCard
                title="Estadísticas"
                description="Ver estadísticas generales"
                icon={<Activity className="w-6 h-6" />}
                href="/admin/stats"
                color="indigo"
              />
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'indigo' | 'teal' | 'red';
}

function QuickActionCard({ title, description, icon, href, color }: QuickActionCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 border-blue-200 dark:border-blue-800',
    green: 'bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900 border-green-200 dark:border-green-800',
    purple: 'bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900 border-purple-200 dark:border-purple-800',
    orange: 'bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900 border-orange-200 dark:border-orange-800',
    indigo: 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900 border-indigo-200 dark:border-indigo-800',
    teal: 'bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-900 border-teal-200 dark:border-teal-800',
    red: 'bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 border-red-200 dark:border-red-800',
  };

  return (
    <Link href={href}>
      <Card className={`transition-all duration-200 justify-center hover:shadow-md cursor-pointer border h-full ${colorClasses[color]}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">{title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{description}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-1 flex-shrink-0" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

