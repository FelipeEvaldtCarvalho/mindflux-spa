import type { RouteRecordRaw } from "vue-router";
import { defineAsyncComponent } from "vue";
import { homeRoute } from "../home/route";

export const mainRoute: Readonly<RouteRecordRaw> = {
  path: "/",
  component: defineAsyncComponent(() => import("./Main.page.vue")),
  children: [homeRoute],
};
