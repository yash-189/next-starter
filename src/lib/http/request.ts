import type { AxiosInstance, AxiosRequestConfig } from "axios";
import { type Envelope, type Page, unwrap, unwrapPage } from "./envelope";

// Unwraps the response envelope so features get plain data.
// Use getPage for paginated lists.
export interface Http {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  getPage<T>(url: string, config?: AxiosRequestConfig): Promise<Page<T>>;
  post<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T>;
  put<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T>;
  patch<T>(
    url: string,
    body?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T>;
  delete<T = void>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

export function createHttp(instance: AxiosInstance): Http {
  const data = async <T>(request: Promise<{ data: Envelope<T> }>) =>
    unwrap((await request).data);

  return {
    get: (url, config) => data(instance.get(url, config)),
    getPage: async (url, config) =>
      unwrapPage((await instance.get(url, config)).data),
    post: (url, body, config) => data(instance.post(url, body, config)),
    put: (url, body, config) => data(instance.put(url, body, config)),
    patch: (url, body, config) => data(instance.patch(url, body, config)),
    delete: async (url, config) => {
      const response = await instance.delete(url, config);
      // 204 has no body.
      return response.status === 204
        ? (undefined as never)
        : unwrap(response.data);
    },
  };
}
