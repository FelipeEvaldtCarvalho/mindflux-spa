import { createRouter, createWebHistory } from "vue-router";
import { dashboardRoute } from "../modules/dashboard/routes";
import { loginRoutes } from "../modules/login/routes";

const router = createRouter({
  history: createWebHistory(),
  routes: [...dashboardRoute, ...loginRoutes],
});

export default router;
