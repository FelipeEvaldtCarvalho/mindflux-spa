import { ref, reactive, toRefs } from "vue";
import customersService from "../services/customers.service";
import type { Customers } from "../services/customers.types";

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
    initialized.value = true;
  }
};

export const useCustomers = () => {
  // if (!initialized.value) {
  getData();
  // }
  customersService.getData();
  return {
    ...toRefs(state),
  };
};
