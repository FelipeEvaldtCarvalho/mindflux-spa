import type { RouteRecordRaw } from "vue-router";
import { loginRoute } from "./login/route";

// Não há cadastro público: as contas são criadas pelo admin em Operadores.
export const authRoute: Readonly<RouteRecordRaw> = {
  path: "/auth",
  component: () => import("./Auth.page.vue"),
  redirect: { name: "auth.login" },
  children: [loginRoute],
};
