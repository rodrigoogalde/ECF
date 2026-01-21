export const ROUTES = {
  HOME: "/",
  MAIN: "/main",
  QUESTIONS: "/questions",
  SYLLABUS: "/syllabus",
  LOGIN: "/login",
  DOCS: {
    LIST: "/docs",
    DETAIL: (id: string) => `/docs/${id}`,
  },

  STUDENT: {
    HOME: "/student",
    PRACTICE: {
      LIST: "/student/practice",
      ATTEMPTS: "/student/practice/attempts",
      DETAIL: (id: string) => `/student/practice/${id}`,
    },
    MATERIAL: {
      LIST: "/student/material",
      DETAIL: (id: string) => `/student/material/${id}`,
    },

    PROGRESS: "/student/practice",
  },

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
    STATS: '/admin/stats',
  },
}