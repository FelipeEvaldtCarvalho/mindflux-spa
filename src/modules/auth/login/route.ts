import type { RouteRecordRaw } from "vue-router";

export const loginRoute: Readonly<RouteRecordRaw> = {
  path: "login",
  name: "auth.login",
  component: () => import("./Login.page.vue"),
};
