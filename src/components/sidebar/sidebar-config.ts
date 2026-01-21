import { ROUTES } from "@/lib/config/routes"
import {
  LifeBuoy,
  Send,
  Settings2,
  Paperclip,
  Home,
  Boxes,
  FolderOpen,
  FileChartColumn,
  FlaskConicalIcon
} from "lucide-react"

export const config = {
  navMain: [
    {
        title: "Inicio",
        url: ROUTES.MAIN,
        icon: Home,
        showFor: ['STUDENT', 'ADMIN'],
    },
    {
      title: "Resumenes",
      url: ROUTES.SUMMARY.LIST,
      icon: Paperclip,
      showFor: ['STUDENT', 'ADMIN'],
    },
    {
        title: "Mis Pruebas",
        url: '#',
        icon: FlaskConicalIcon,
        isActive: true,
        showFor: ['STUDENT', 'ADMIN'],
        items: [
            {
            title: "Practicar",
            url: ROUTES.STUDENT.PRACTICE.LIST,
            },
            {
            title: "Mis Intentos",
            url: ROUTES.STUDENT.PRACTICE.ATTEMPTS,
            },
        ],
    },
    {
        title: "Administrador",
        url: "#",
        icon: Settings2,
        showFor: ['ADMIN'],
        items: [
            {
            title: "Preguntas",
            url: ROUTES.ADMIN.QUESTIONS.LIST,
            },
            {
            title: "Tests",
            url: ROUTES.ADMIN.TESTS.LIST,
            },
            {
            title: "Usuarios",
            url: ROUTES.ADMIN.USERS.LIST,
            },
        ],
    },
    {
      title: "Reportes",
      url: "#",
      icon: FileChartColumn,
      showFor: ['ADMIN'],
    },
  ],
  navFooter: [
    {
        title: "Ayuda",
        url: "https://docs.google.com/forms/d/e/1FAIpQLSeRyc-6FUkB7KTQLZ8bci1vhTjlTi7Nb--1WlKgdydFwMj7Yw/viewform?usp=dialog",
        icon: LifeBuoy,
    },
  ],
}