import { reactive, toRefs, computed } from "vue";
import service from "../services";
import router from "../../../../router";

const state = reactive({
  isSubmitting: false,
  email: "",
  password: "",
});

const login = async () => {
  try {
    if (isDisabledButton.value) return;
    const payload = {
      email: state.email,
      password: state.password,
    };
    state.isSubmitting = true;
    const { token } = await service.login(payload);
    localStorage.setItem("user_token", token);
    router.push({ name: "Dashboard" });
  } catch (error) {
    console.error("Login failed:", error);
  } finally {
    state.isSubmitting = false;
    state.email = "";
    state.password = "";
  }
};

const isDisabledButton = computed(() => {
  return !state.email || !state.password || state.isSubmitting;
});

export const useLogin = () => {
  return {
    ...toRefs(state),
    login,
    isDisabledButton,
  };
};
