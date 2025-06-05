import type { RouteRecordRaw } from "vue-router";
import { defineAsyncComponent } from "vue";

export const homeRoute: Readonly<RouteRecordRaw> = {
  path: "/",
  name: "Home",
  component: defineAsyncComponent(() => import("./Home.page.vue")),
};
