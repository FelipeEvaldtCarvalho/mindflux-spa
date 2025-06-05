import { reactive, toRefs, computed } from "vue";
import axios from "axios";

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
    const { data } = await axios.post(
      "http://localhost:3000/auth/login",
      payload
    );
    console.log("Login successful:", data);
  } catch (error) {
    console.error("Login failed:", error);
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
