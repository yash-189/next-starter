export const Endpoints = {
  auth: {
    login: "/auth/login",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
  },
  tasks: {
    list: "/tasks",
    one: (id: string) => `/tasks/${encodeURIComponent(id)}`,
  },
} as const;
