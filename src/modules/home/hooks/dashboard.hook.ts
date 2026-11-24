import dashboardService from "../services/dashboard.service";
import appointmentsService, {
  type Appointment,
} from "@/modules/appointments/services/appointments.service";
import { reactive, toRefs } from "vue";
import type { DashboardInfo } from "../services/dashboard.types";
import { todayAPI } from "@/helpers/date.helper";

const state = reactive({
  isLoading: true,
  hasError: false,
  dashboardData: null as null | DashboardInfo,
  todayAppointments: [] as Appointment[],
});

// Recarrega sempre que a tela abre (antes ficava preso no primeiro resultado,
// inclusive depois de trocar de conta).
const getData = async () => {
  try {
    state.isLoading = true;
    state.hasError = false;
    const now = new Date();
    const [dashboard, month] = await Promise.all([
      dashboardService.getData(),
      appointmentsService.getMonthData(now.getFullYear(), now.getMonth() + 1),
    ]);
    const today = todayAPI();
    state.dashboardData = dashboard;
    state.todayAppointments = month
      .filter((a) => a.date === today)
      .sort((a, b) => a.time.localeCompare(b.time));
  } catch {
    state.hasError = true;
  } finally {
    state.isLoading = false;
  }
};

export const useDashboard = () => ({
  ...toRefs(state),
  getData,
});
