import axios from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { reactive } from "vue";

import { clearSession, getToken } from "./session.service";
import router from "../router";

// O Render (plano grátis) desliga a API sem uso e leva até ~1 min para religar.
// Se uma requisição demora, o App mostra um aviso em vez de parecer travado.
const SLOW_REQUEST_MS = 4000;
export const connectionState = reactive({ slowRequests: 0 });

const slowTimers = new WeakMap<object, ReturnType<typeof setTimeout>>();

const startTracking = (config: InternalAxiosRequestConfig) => {
  const timer = setTimeout(() => {
    connectionState.slowRequests++;
    (config as any).__slow = true;
  }, SLOW_REQUEST_MS);
  slowTimers.set(config, timer);
};

const stopTracking = (config?: InternalAxiosRequestConfig) => {
  if (!config) return;
  clearTimeout(slowTimers.get(config));
  if ((config as any).__slow) {
    connectionState.slowRequests = Math.max(0, connectionState.slowRequests - 1);
  }
};

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/",
  timeout: 90_000,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  config.headers.set("Content-Type", "application/json");
  startTracking(config);
  return config;
});

api.interceptors.response.use(
  (response) => {
    stopTracking(response.config);
    return response;
  },
  (error) => {
    stopTracking(error.config);

    // Sessão expirada ou usuário desativado: volta para o login.
    // (Antes comparava statusText === "Unauthorized", que vem vazio em HTTP/2.)
    const isLoginRequest = error.config?.url?.includes("auth/login");
    if (error.response?.status === 401 && !isLoginRequest) {
      clearSession();
      const current = router.currentRoute.value;
      if (!current.path.startsWith("/auth")) {
        router.push({ name: "auth.login", query: { redirect: current.fullPath } });
      }
    }

    return Promise.reject(error);
  }
);

export default { axios: api };
