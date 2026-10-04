export const Routes = {
  home: "/",
  login: "/login",
  tasks: "/tasks",
  // Must match the app/api/backend folder.
  backendApi: "/api/backend",
  authRefresh: "/api/auth/refresh",
} as const;

export const SIGNED_IN_ROUTES = [Routes.tasks] as const;
