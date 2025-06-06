import type { RouteRecordRaw } from "vue-router";
import { loginRoute } from "./login/route";
import { createRoute } from "./create/route";

export const authRoute: Readonly<RouteRecordRaw> = {
  path: "/auth",
  component: () => import("./Auth.page.vue"),
  children: [loginRoute, createRoute],
};
