import type { RouteRecordRaw } from "vue-router";
import { defineAsyncComponent } from "vue";

export const loginRoute: Readonly<RouteRecordRaw> = {
  path: "login",
  component: defineAsyncComponent(() => import("./Login.page.vue")),
};
