import { createRouter, createWebHistory } from "vue-router";
import type { Router } from "vue-router";
import { mainRoute } from "../modules/main/route";
import { authRoute } from "../modules/auth/route";

const router: Router = createRouter({
  history: createWebHistory(),
  routes: [mainRoute, authRoute],
});

export default router;
