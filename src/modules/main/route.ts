import type { RouteRecordRaw } from "vue-router";
import { homeRoute } from "../home/route";
import { customersRoute } from "@/modules/customers/route";
import { counselingRoute } from "@/modules/counseling/route";

export const mainRoute: Readonly<RouteRecordRaw> = {
  path: "/",
  component: () => import("./Main.page.vue"),
  children: [homeRoute, customersRoute, counselingRoute],
};
