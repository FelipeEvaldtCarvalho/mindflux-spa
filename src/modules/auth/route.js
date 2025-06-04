import Auth from "./Auth.page.vue";
import { loginRoute } from "./login/route";

export const authRoutes = [
  {
    path: "/auth",
    component: Auth,
    children: [loginRoute],
  },
];
