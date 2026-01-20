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
        url: "/dashboard",
        icon: Home,
        showFor: ['STUDENT', 'ADMIN'],
    },
    {
        title: "Mis Pruebas",
        url: "#",
        icon: FlaskConicalIcon,
        isActive: true,
        showFor: ['STUDENT'],
        items: [
            {
            title: "Practicar",
            url: "/student/practice",
            },
            {
            title: "Mis Intentos",
            url: "/student/practice/attempts",
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
            url: "/admin/questions",
            },
            {
            title: "Tests",
            url: "/admin/tests",
            },
            {
            title: "Usuarios",
            url: "/admin/users",
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