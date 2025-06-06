import type { RouteRecordRaw } from "vue-router";

export const createRoute: Readonly<RouteRecordRaw> = {
  path: "create",
  name: "auth.create",
  component: () => import("./Create.page.vue"),
};
