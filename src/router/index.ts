import { createRouter, createWebHistory } from "vue-router";
import { dashboardRoute } from "../modules/dashboard/route";
import { authRoute } from "../modules/auth/route";

const router = createRouter({
  history: createWebHistory(),
  routes: [...dashboardRoute, authRoute],
});

export default router;
