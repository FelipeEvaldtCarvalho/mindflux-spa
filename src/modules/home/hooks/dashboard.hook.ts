import dashboardService from "../services/dashboard.service";
import { ref, reactive, toRefs } from "vue";
import type { DashboardInfo } from "../services/dashboard.types";

const initialized = ref(false);

const state = reactive({
  isLoading: true,
  hasError: false,
  dashboardData: null as null | DashboardInfo,
});

const getData = async () => {
  try {
    state.isLoading = true;
    state.hasError = false;
    state.dashboardData = await dashboardService.getData();
  } catch {
    state.hasError = true;
  } finally {
    state.isLoading = false;
  }
};

export const useDashboard = () => {
  if (!initialized.value) {
    getData();
  }
  return {
    ...toRefs(state),
    getData,
  };
};
