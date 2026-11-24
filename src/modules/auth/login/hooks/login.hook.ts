import { reactive, toRefs, computed } from "vue";
import { isAxiosError } from "axios";
import service from "../services";
import { useToast } from "primevue/usetoast";
import { useRoute, useRouter } from "vue-router";
import { setToken } from "@/services/session.service";
import { getApiErrorMessage } from "@/helpers/api-error.helper";

const state = reactive({
  isSubmitting: false,
  email: "",
  password: "",
});

const isDisabledButton = computed(() => {
  return !state.email.trim() || !state.password || state.isSubmitting;
});

export const useLogin = () => {
  const toast = useToast();
  const router = useRouter();
  const route = useRoute();

  const login = async () => {
    if (isDisabledButton.value) return;
    try {
      state.isSubmitting = true;
      const { token } = await service.login({
        email: state.email.trim(),
        password: state.password,
      });
      setToken(token);
      state.password = "";

      // Volta para a página que a pessoa tentou abrir antes do login.
      const redirect = route.query.redirect;
      const target =
        typeof redirect === "string" && redirect.startsWith("/") ? redirect : "/";
      router.replace(target);
    } catch (error) {
      // Mantém o e-mail digitado; só limpa a senha.
      state.password = "";
      const detail =
        isAxiosError(error) && error.response?.status === 401
          ? error.response.data?.message === "Usuário desativado"
            ? "Seu acesso foi desativado. Fale com o administrador."
            : "E-mail ou senha incorretos."
          : getApiErrorMessage(error, "Não foi possível entrar. Tente novamente.");
      toast.add({ severity: "error", summary: "Não foi possível entrar", detail, life: 5000 });
    } finally {
      state.isSubmitting = false;
    }
  };

  return {
    ...toRefs(state),
    login,
    isDisabledButton,
  };
};
