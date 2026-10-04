import { isAxiosError } from "axios";

const FALLBACK = "Something went wrong. Please try again.";
const NETWORK = "Couldn't reach the server. Check your connection.";

// Match on codes, not message text.
export const ErrorCode = {
  sessionRevoked: "SESSION_REVOKED",
} as const;

export interface FieldError {
  field: string;
  message: string;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly fieldErrors: FieldError[];

  constructor({
    status,
    code,
    message,
    fieldErrors,
  }: {
    status: number;
    code?: string;
    message?: string;
    fieldErrors?: FieldError[];
  }) {
    super(message || FALLBACK);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors ?? [];
  }
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  if (!isAxiosError(error)) return new ApiError({ status: 0 });
  if (!error.response) return new ApiError({ status: 0, message: NETWORK });
  const body = error.response.data as
    | {
        errorCode?: string;
        message?: string;
        errors?: FieldError[];
      }
    | undefined;
  return new ApiError({
    status: error.response.status,
    code: body?.errorCode,
    message: body?.message,
    fieldErrors: body?.errors,
  });
}
