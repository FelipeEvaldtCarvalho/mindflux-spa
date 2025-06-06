import type { RouteRecordRaw } from "vue-router";

export const homeRoute: Readonly<RouteRecordRaw> = {
  path: "/",
  name: "Home",
  component: () => import("./Home.page.vue"),
};
