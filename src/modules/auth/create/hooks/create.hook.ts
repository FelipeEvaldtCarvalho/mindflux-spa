import { reactive, toRefs, computed } from "vue";
import service from "../services";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import type { CreatePayload } from "../services";

const state = reactive({
  isSubmitting: false,
});

export const useCreate = () => {
  const toast = useToast();
  const router = useRouter();

  const create = async (payload: CreatePayload) => {
    try {
      state.isSubmitting = true;
      const { token } = await service.create(payload);
      localStorage.setItem("user_token", token);
      router.push({ name: "Home" });
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      toast.add({
        severity: "error",
        summary: "Erro!",
        detail: "Erro ao criar usuário. Verifique os dados informados.",
        life: 4000,
      });
    } finally {
      state.isSubmitting = false;
    }
  };

  return {
    ...toRefs(state),
    create,
  };
};
