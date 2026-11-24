import type { Router } from "vue-router";
import { getToken } from "@/services/session.service";
import { useUser } from "@/modules/main/hooks/user.hook";

export function setupAuthGuard(router: Router) {
  router.beforeEach(async (to) => {
    const hasToken = !!getToken();
    const isAuthPage = to.path.startsWith("/auth");

    // Já logado não precisa ver o login.
    if (isAuthPage) {
      return hasToken ? { path: "/" } : true;
    }

    // Páginas internas exigem login; guarda o destino para voltar depois.
    if (!hasToken) {
      return { name: "auth.login", query: { redirect: to.fullPath } };
    }

    // Páginas só do admin (ex.: Operadores).
    if (to.meta.requiresAdmin) {
      const { loadUser } = useUser();
      const user = await loadUser();
      if (user?.role !== "admin") return { path: "/" };
    }

    return true;
  });
}
