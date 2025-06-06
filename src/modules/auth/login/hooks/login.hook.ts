import { reactive, toRefs, computed } from "vue";
import service from "../services";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";

const state = reactive({
  isSubmitting: false,
  email: "",
  password: "",
});

const isDisabledButton = computed(() => {
  return !state.email || !state.password || state.isSubmitting;
});

export const useLogin = () => {
  const toast = useToast();
  const router = useRouter();

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
      router.push({ name: "Home" });
    } catch (error) {
      toast.add({
        severity: "error",
        summary: "Erro!",
        detail: "Credenciais inválidas.",
        life: 4000,
      });
    } finally {
      state.isSubmitting = false;
      state.email = "";
      state.password = "";
    }
  };

  return {
    ...toRefs(state),
    login,
    isDisabledButton,
  };
};
