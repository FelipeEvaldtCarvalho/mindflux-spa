import type { RouteRecordRaw } from "vue-router";

export const customersRoute: Readonly<RouteRecordRaw> = {
  path: "/customers",
  component: () => import("./Customers.page.vue"),
};
