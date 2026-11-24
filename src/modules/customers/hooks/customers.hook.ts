import { reactive, toRefs } from "vue";
import customersService from "../services/customers.service";
import type { Customers, CustomerPayload } from "../services/customers.types";
import { useToast } from "primevue/usetoast";
import { getApiErrorMessage } from "@/helpers/api-error.helper";

const state = reactive({
  isLoading: false,
  isSaving: false,
  hasError: false,
  customers: [] as Customers,
});

const getData = async () => {
  try {
    state.isLoading = true;
    state.hasError = false;
    state.customers = await customersService.getData();
  } catch {
    state.customers = [];
    state.hasError = true;
  } finally {
    state.isLoading = false;
  }
};

export const useCustomers = () => {
  const toast = useToast();

  const notifyError = (summary: string, error: unknown) =>
    toast.add({
      severity: "error",
      summary,
      detail: getApiErrorMessage(error, "Tente novamente em instantes."),
      life: 5000,
    });

  // Retornam true/false para a tela decidir se fecha o formulário
  // (antes o formulário era apagado mesmo quando dava erro).
  const createCustomer = async (payload: CustomerPayload): Promise<boolean> => {
    try {
      state.isSaving = true;
      await customersService.createCustomer(payload);
      toast.add({ severity: "success", summary: "Cliente cadastrado", life: 3000 });
      await getData();
      return true;
    } catch (error) {
      notifyError("Não foi possível cadastrar", error);
      return false;
    } finally {
      state.isSaving = false;
    }
  };

  const updateCustomer = async (id: number, payload: CustomerPayload): Promise<boolean> => {
    try {
      state.isSaving = true;
      await customersService.updateCustomer(id, payload);
      toast.add({ severity: "success", summary: "Cliente atualizado", life: 3000 });
      await getData();
      return true;
    } catch (error) {
      notifyError("Não foi possível salvar", error);
      return false;
    } finally {
      state.isSaving = false;
    }
  };

  const deleteCustomer = async (id: number): Promise<boolean> => {
    try {
      state.isSaving = true;
      await customersService.deleteCustomer(id);
      toast.add({ severity: "success", summary: "Cliente excluído", life: 3000 });
      await getData();
      return true;
    } catch (error) {
      notifyError("Não foi possível excluir", error);
      return false;
    } finally {
      state.isSaving = false;
    }
  };

  return {
    ...toRefs(state),
    createCustomer,
    updateCustomer,
    deleteCustomer,
    getData,
  };
};
