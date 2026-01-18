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
            title: "Todos",
            url: "/student/tests",
            },
            {
            title: "Nueva",
            url: "/student/tests/new",
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