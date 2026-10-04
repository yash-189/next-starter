import axios, { type InternalAxiosRequestConfig, isAxiosError } from "axios";
import { Routes } from "../routes";
import { rejectFailedEnvelope } from "./envelope";
import { ErrorCode, toApiError } from "./errors";
import { serializeParams } from "./params";
import { createHttp } from "./request";

const clientAxios = axios.create({
  baseURL: Routes.backendApi,
  paramsSerializer: serializeParams,
});

type RetryableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

// Shared so parallel 401s trigger a single refresh. Two refreshes at once
// would fight over a rotating refresh token.
let refreshing: Promise<boolean> | null = null;

function refreshOnce() {
  refreshing ??= axios
    .post(Routes.authRefresh)
    .then(() => true)
    .catch(() => false)
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

function signOut() {
  window.location.assign(Routes.login);
}

clientAxios.interceptors.response.use(rejectFailedEnvelope, async (error) => {
  const apiError = toApiError(error);
  const config = isAxiosError(error)
    ? (error.config as RetryableConfig | undefined)
    : undefined;

  if (apiError.status !== 401 || !config || config._retried) {
    throw apiError;
  }
  if (apiError.code === ErrorCode.sessionRevoked || !(await refreshOnce())) {
    signOut();
    throw apiError;
  }
  config._retried = true;
  return clientAxios(config);
});

export const clientHttp = createHttp(clientAxios);
