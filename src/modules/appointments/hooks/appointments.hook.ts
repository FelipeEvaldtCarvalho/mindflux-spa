import { reactive, toRefs, computed } from "vue";
import appointmentsService from "../services/appointments.service";
import type {
  Appointment,
  CreateAppointmentPayload,
} from "../services/appointments.service";
import { useToast } from "primevue/usetoast";
import { formatDateToAPI } from "@/helpers/date.helper";
import { getApiErrorMessage } from "@/helpers/api-error.helper";

const today = new Date();

const state = reactive({
  isLoadingMonthData: false,
  isCreating: false,
  calendar: today, // dia selecionado
  viewYear: today.getFullYear(), // mês exibido no calendário
  viewMonth: today.getMonth() + 1,
  monthData: [] as Appointment[],
});

let lastRequest = 0;

const loadMonth = async (year = state.viewYear, month = state.viewMonth) => {
  state.viewYear = year;
  state.viewMonth = month;
  const requestId = ++lastRequest;
  try {
    state.isLoadingMonthData = true;
    const data = await appointmentsService.getMonthData(year, month);
    // Ignora respostas atrasadas de um mês que já não está na tela.
    if (requestId === lastRequest) state.monthData = data;
  } catch {
    if (requestId === lastRequest) state.monthData = [];
  } finally {
    if (requestId === lastRequest) state.isLoadingMonthData = false;
  }
};

const selectedDateAPI = computed(() => formatDateToAPI(state.calendar));

// Compara a data inteira (antes comparava só o dia do mês e misturava meses).
const selectedDayAppointments = computed(() =>
  state.monthData
    .filter((a) => a.date === selectedDateAPI.value)
    .sort((a, b) => a.time.localeCompare(b.time))
);

const daysWithAppointments = computed(() => new Set(state.monthData.map((a) => a.date)));

export const useAppointments = () => {
  const toast = useToast();

  const createAppointment = async (payload: CreateAppointmentPayload) => {
    try {
      state.isCreating = true;
      await appointmentsService.create(payload);
      toast.add({ severity: "success", summary: "Agendado", life: 3000 });
      await loadMonth();
      return true;
    } catch (error) {
      toast.add({
        severity: "error",
        summary: "Não foi possível agendar",
        detail: getApiErrorMessage(error, "Tente novamente."),
        life: 5000,
      });
      return false;
    } finally {
      state.isCreating = false;
    }
  };

  const deleteAppointment = async (id: number) => {
    try {
      await appointmentsService.delete(id);
      state.monthData = state.monthData.filter((a) => a.id !== id);
      toast.add({ severity: "success", summary: "Agendamento excluído", life: 3000 });
    } catch (error) {
      toast.add({
        severity: "error",
        summary: "Não foi possível excluir",
        detail: getApiErrorMessage(error, "Tente novamente."),
        life: 5000,
      });
      await loadMonth();
    }
  };

  // Ao escolher um dia de outro mês, carrega esse mês.
  const selectDate = (date: Date) => {
    state.calendar = date;
    if (date.getFullYear() !== state.viewYear || date.getMonth() + 1 !== state.viewMonth) {
      loadMonth(date.getFullYear(), date.getMonth() + 1);
    }
  };

  return {
    ...toRefs(state),
    selectedDateAPI,
    selectedDayAppointments,
    daysWithAppointments,
    loadMonth,
    selectDate,
    createAppointment,
    deleteAppointment,
  };
};
