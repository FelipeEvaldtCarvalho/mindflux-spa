import { computed, reactive, toRefs } from "vue";
import userService from "../services/user.service";
import type { User } from "../services/user.types";

const state = reactive({
  isLoading: false,
  user: null as User | null,
});

const isAdmin = computed(() => state.user?.role === "admin");

// Busca o usuário logado (com cache por token). Se o token não vale mais,
// o interceptor da API já manda para o login.
const loadUser = async (): Promise<User | null> => {
  try {
    state.isLoading = true;
    state.user = await userService.me();
  } catch {
    state.user = null;
  } finally {
    state.isLoading = false;
  }
  return state.user;
};

export const useUser = () => {
  return {
    ...toRefs(state),
    isAdmin,
    loadUser,
    // Mantido pelo nome antigo usado no Main.page
    getUser: loadUser,
  };
};
