import { ApiError, type FieldError } from "./errors";

// Adjust these types if your API's response shape is different.

interface PageMeta {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

interface Success<T> {
  success: true;
  data: T;
  meta?: PageMeta;
}

interface Failure {
  success: false;
  statusCode?: number;
  errorCode?: string;
  message?: string;
  errors?: FieldError[];
}

export type Envelope<T> = Success<T> | Failure;

export interface Page<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export function failureToError(body: Failure, status: number) {
  return new ApiError({
    status: body.statusCode ?? status,
    code: body.errorCode,
    message: body.message,
    fieldErrors: body.errors,
  });
}

export function unwrap<T>(body: Envelope<T>): T {
  if (!body.success) throw failureToError(body, 0);
  return body.data;
}

export function unwrapPage<T>(body: Envelope<T[]>): Page<T> {
  const items = unwrap(body);
  const meta = body.success ? body.meta : undefined;
  return {
    items,
    page: meta?.page ?? 1,
    pageSize: meta?.pageSize ?? items.length,
    totalCount: meta?.totalCount ?? items.length,
    totalPages: meta?.totalPages ?? 1,
  };
}

// Some APIs return 200 with success: false.
export function rejectFailedEnvelope<
  R extends { data: unknown; status: number },
>(response: R): R {
  const body = response.data as Partial<Failure> | undefined;
  if (body && body.success === false) {
    throw failureToError(body as Failure, response.status);
  }
  return response;
}
