import "server-only";
import axios from "axios";
import { env } from "../env";
import { getAccessToken } from "../session";
import { rejectFailedEnvelope } from "./envelope";
import { toApiError } from "./errors";
import { serializeParams } from "./params";
import { createHttp } from "./request";

// Shared across requests, so the token is read per call. Never set it on
// defaults or one user's token leaks into another's request.
const serverAxios = axios.create({
  baseURL: env.API_URL,
  paramsSerializer: serializeParams,
});

serverAxios.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

serverAxios.interceptors.response.use(rejectFailedEnvelope, (error) =>
  Promise.reject(toApiError(error)),
);

export const serverHttp = createHttp(serverAxios);
