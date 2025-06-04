import Login from "./page.vue";

export const loginRoutes = [
  {
    path: "/auth",
    children: [{ path: "login", name: "Login", component: Login }],
  },
];
