import { createRouter, createWebHistory } from "vue-router";
import type { Router } from "vue-router";
import { mainRoute } from "../modules/main/route";
import { authRoute } from "../modules/auth/route";
import { setupAuthGuard } from "./auth.guard";

const router: Router = createRouter({
  history: createWebHistory(),
  routes: [
    mainRoute,
    authRoute,
    // Qualquer endereço desconhecido volta para o início.
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
  scrollBehavior: () => ({ top: 0 }),
});

setupAuthGuard(router);

export default router;
