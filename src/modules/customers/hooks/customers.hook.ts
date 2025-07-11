import { ref, reactive, toRefs } from "vue";
import customersService from "../services/customers.service";
import type { Customers, CreateCustomer } from "../services/customers.types";
import { useToast } from "primevue/usetoast";

const initialized = ref(false);

const state = reactive({
  isLoading: true,
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

  const createCustomer = async (payload: CreateCustomer) => {
    try {
      state.isLoading = true;
      await customersService.createCustomer(payload);
      toast.add({
        severity: "success",
        summary: "Sucesso!",
        detail: "Cliente criado com sucesso.",
        life: 3000,
      });
      await getData();
    } catch (error) {
      toast.add({
        severity: "error",
        summary: "Erro!",
        detail: "Houve um erro ao criar o cliente.",
        life: 3000,
      });
    } finally {
      state.isLoading = false;
    }
  };

  const updateCustomer = async (id: string, payload: CreateCustomer) => {
    try {
      state.isLoading = true;
      await customersService.updateCustomer(id, payload);
      toast.add({
        severity: "success",
        summary: "Sucesso!",
        detail: "Cliente atualizado com sucesso.",
        life: 3000,
      });
      await getData();
    } catch (error) {
      toast.add({
        severity: "error",
        summary: "Erro!",
        detail: "Houve um erro ao atualizar o cliente.",
        life: 3000,
      });
    } finally {
      state.isLoading = false;
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      state.isLoading = true;
      await customersService.deleteCustomer(id);
      toast.add({
        severity: "success",
        summary: "Sucesso!",
        detail: "Cliente excluído com sucesso.",
        life: 3000,
      });
      await getData();
    } catch (error) {
      toast.add({
        severity: "error",
        summary: "Erro!",
        detail: "Houve um erro ao excluir o cliente.",
        life: 3000,
      });
    } finally {
      state.isLoading = false;
    }
  };

  if (!initialized.value) {
    getData();
    initialized.value = true;
  }

  return {
    ...toRefs(state),
    createCustomer,
    updateCustomer,
    deleteCustomer,
    getData,
  };
};
