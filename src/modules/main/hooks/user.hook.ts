import { reactive, toRefs } from "vue";
import userService from "../services/user.service";
import type { User } from "../services/user.types";
import logoutService from "@/services/logout.service";

const state = reactive({
  isLoading: true,
  user: null as User | null,
});

const getUser = async () => {
  try {
    state.isLoading = true;
    state.user = await userService.me();
  } catch (error) {
    logoutService.logout();
  } finally {
    state.isLoading = false;
  }
};

export const useUser = () => {
  return {
    ...toRefs(state),
    getUser,
  };
};
