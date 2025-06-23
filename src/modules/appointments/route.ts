import type { RouteRecordRaw } from "vue-router";

export const appointmentsRoute: Readonly<RouteRecordRaw> = {
  path: "appointments",
  name: "appointments",
  component: () => import("./Appointments.page.vue"),
};
