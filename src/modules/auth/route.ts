import type { RouteRecordRaw } from "vue-router";
import { defineAsyncComponent } from "vue";
import { loginRoute } from "./login/route";

export const authRoute: Readonly<RouteRecordRaw> = {
  path: "/auth",
  component: defineAsyncComponent(() => import("./Auth.page.vue")),
  children: [loginRoute],
};
