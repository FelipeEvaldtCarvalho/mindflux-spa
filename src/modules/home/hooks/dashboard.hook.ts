import dashboardService from "../services/dashboard.service";
import { ref, reactive, toRefs } from "vue";
import type { DashboardInfo } from "../services/dashboard.types";

const initialized = ref(false);

const state = reactive({
  isLoading: true,
  dashboardData: null as null | DashboardInfo,
});
const getData = async () => {
  try {
    state.dashboardData = await dashboardService.getData();
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  } finally {
  }
};

export const useDashboard = () => {
  if (!initialized.value) {
    getData();
  }
  return {
    ...toRefs(state),
  };
};
