import type { RouteRecordRaw } from "vue-router";

export const counselingRoute: Readonly<RouteRecordRaw> = {
  path: "counseling",
  name: "counseling",
  component: () => import("./Counseling.page.vue"),
  children: [
    {
      path: "customer/:id",
      name: "counseling.customer",
      component: () =>
        import("./components/CounselingCustomer/CounselingCustomer.vue"),
    },
    {
      path: "",
      name: "counseling.select-customer",
      component: () => import("./components/SelectCustomer.vue"),
    },
  ],
};
