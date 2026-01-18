export const ROUTES = {
  HOME: "/",
  QUESTIONS: "/questions",
  SYLLABUS: "/syllabus",
  LOGIN: "/login",

  STUDENT: "/student",
  // Rutas de administración
  ADMIN: {
    QUESTIONS: {
      LIST: '/admin/questions',
      CREATE: '/admin/questions/create',
      EDIT: (id: string | number) => `/admin/questions/${id}/edit`,
    },
    USERS: {
      LIST: '/admin/users',
      CREATE: '/users/create',
      EDIT: (id: string | number) => `/users/${id}/edit`,
    },
  },
}