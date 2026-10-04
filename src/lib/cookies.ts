// Separate from session.ts because proxy.ts can't import server-only code.
export const SessionCookie = {
  access: "session",
  refresh: "refresh",
} as const;
