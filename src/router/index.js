import { createRouter, createWebHistory } from "vue-router";
import { dashboardRoute } from "../modules/dashboard/routes";
import { authRoutes } from "../modules/auth/route";

const router = createRouter({
  history: createWebHistory(),
  routes: [...dashboardRoute, ...authRoutes],
});

export default router;
