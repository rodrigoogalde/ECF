import {
  LifeBuoy,
  Send,
  Settings2,
  Paperclip,
  Home,
  Boxes,
  FolderOpen,
  FileChartColumn,
} from "lucide-react"

export const config = {
  navMain: [
    {
        title: "Inicio",
        url: "/main",
        icon: Home,
        showFor: ['STUDENT', 'ADMIN'],
    },
    {
        title: "Mis Registros",
        url: "#",
        icon: Paperclip,
        isActive: true,
        showFor: ['STUDENT'],
        items: [
            {
            title: "Todos",
            url: "/student/records",
            },
            {
            title: "Nuevo Registro",
            url: "/student/records/new",
            },
            {
            title: "Analitica",
            url: "/student/dashboard",
            },
        ],
    },
    {
        title: "Registros por revisar",
        url: "#",
        icon: FolderOpen,
        isActive: true,
        showFor: ['ADMIN'],
        items: [
            {
            title: "Todos",
            url: "/admin/records/review",
            },
            {
            title: "Analitica",
            url: "/admin/dashboard",
            },
        ],
    },
    {
        title: "Mi Área",
        url: "/area",
        icon: Boxes,
        showFor: ['STUDENT', 'ADMIN'],
    },
    {
      title: "Reportes",
      url: "#",
      icon: FileChartColumn,
      showFor: ['STUDENT', 'ADMIN'],
      comingSoon: true,
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
            {
            title: "Perfiles",
            url: "/admin/profiles",
            },
            {
            title: "Áreas",
            url: "/admin/areas",
            },
            {
            title: "Cirugias",
            url: "/admin/surgeries",
            },
            {
            title: "Registros",
            url: "/admin/records",
            },
        ],
    },
  ],
  navFooter: [
    {
        title: "Ayuda",
        url: "https://docs.google.com/forms/d/e/1FAIpQLSeRyc-6FUkB7KTQLZ8bci1vhTjlTi7Nb--1WlKgdydFwMj7Yw/viewform?usp=dialog",
        icon: LifeBuoy,
    },
    {
        title: "Ayudanos a mejorar!",
        url: "https://docs.google.com/forms/d/e/1FAIpQLSeRyc-6FUkB7KTQLZ8bci1vhTjlTi7Nb--1WlKgdydFwMj7Yw/viewform?usp=dialog",
        icon: Send,
    },
  ],
}