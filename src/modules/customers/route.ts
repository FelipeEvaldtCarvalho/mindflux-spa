import type { RouteRecordRaw } from "vue-router";
import { defineAsyncComponent } from "vue";

export const customersRoute: Readonly<RouteRecordRaw> = {
  path: "/customers",
  component: defineAsyncComponent(() => import("./Customers.page.vue")),
};
