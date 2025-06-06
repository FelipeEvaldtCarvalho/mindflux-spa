import type { Router } from "vue-router";
import apiService from "@/services/api.service";

export function setupAuthGuard(router: Router) {
  router.beforeEach(async (to, _, next) => {
    if (to.path.startsWith("/auth")) {
      const token = localStorage.getItem("user_token");
      if (!token) return next();
      try {
        await apiService.axios.get("/auth/verify-token");
        return next("/");
      } catch {
        localStorage.removeItem("user_token");
        return next();
      }
    }

    next();
  });
}
