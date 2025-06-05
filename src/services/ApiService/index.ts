import axios from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";

import router from "../../router";

class ApiService {
  private static instance: ApiService;
  private axiosInstance: AxiosInstance;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/",
    });

    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("user_token");

        if (token) {
          config.headers.set("Authorization", `Bearer ${token}`);
        }

        config.headers.set("Content-Type", "application/json");

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (status === 401 && message === "Unauthorized") {
          localStorage.removeItem("user_token");
          router.push("/auth/login");
        }

        return Promise.reject(error);
      }
    );
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  public get axios() {
    return this.axiosInstance;
  }
}

export default ApiService.getInstance();
