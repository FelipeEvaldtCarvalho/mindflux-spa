import { ref, reactive, toRefs } from "vue";
import customersService from "../services/customers.service";
import type { Customers, CreateCustomer } from "../services/customers.types";
import { useToast } from "primevue/usetoast";

const initialized = ref(false);

const state = reactive({
  isLoading: true,
  customers: [] as Customers,
});

const getData = async () => {
  try {
    state.isLoading = true;
    state.customers = await customersService.getData();
  } catch (error) {
    console.error("Error fetching customers data:", error);
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

  if (!initialized.value) {
    getData();
    initialized.value = true;
  }

  customersService.getData();
  return {
    ...toRefs(state),
    createCustomer,
  };
};
