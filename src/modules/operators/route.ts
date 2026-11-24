import type { RouteRecordRaw } from "vue-router";

export const operatorsRoute: Readonly<RouteRecordRaw> = {
  path: "operators",
  name: "operators",
  meta: { requiresAdmin: true },
  component: () => import("./Operators.page.vue"),
};
