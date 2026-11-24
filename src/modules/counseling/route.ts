import type { RouteRecordRaw } from "vue-router";

export const counselingRoute: Readonly<RouteRecordRaw> = {
  path: "counseling",
  component: () => import("./Counseling.page.vue"),
  children: [
    {
      path: "customer/:id(\\d+)",
      name: "counseling.customer",
      component: () =>
        import("./components/CounselingCustomer/CounselingCustomer.vue"),
    },
    // O atendimento sempre parte de um cliente.
    { path: "", redirect: "/customers" },
  ],
};
