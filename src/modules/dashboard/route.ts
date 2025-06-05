import type { RouteRecordRaw } from "vue-router";
import { defineAsyncComponent } from "vue";

export const dashboardRoute: Readonly<RouteRecordRaw[]> = [
  {
    path: "/",
    name: "Dashboard",
    component: defineAsyncComponent(() => import("./page.vue")),
  },
];
