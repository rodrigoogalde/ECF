export const ROUTES = {
  HOME: "/",
  QUESTIONS: "/questions",
  SYLLABUS: "/syllabus",
  LOGIN: "/login",

  STUDENT: {
    HOME: "/student",
    PRACTICE: "/student/practice",
    ATTEMPTS: "/student/practice/attempts",
    ATTEMPT: (id: string) => `/student/practice/${id}`,
  },
  // Rutas de administración
  ADMIN: {
    ADMIN: '/admin',
    QUESTIONS: {
      LIST: '/admin/questions',
      CREATE: '/admin/questions/create',
      EDIT: (id: string | number) => `/admin/questions/${id}/edit`,
    },
    TESTS: {
      LIST: '/admin/tests',
      CREATE: '/admin/tests/create',
      DETAIL: (id: string | number) => `/admin/tests/${id}`,
    },
    USERS: {
      LIST: '/admin/users',
      CREATE: '/admin/users/create',
      EDIT: (id: string | number) => `/admin/users/${id}/edit`,
    },
  },
}