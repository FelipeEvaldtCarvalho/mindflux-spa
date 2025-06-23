import { reactive, toRefs, computed } from "vue";
import appointmentsService from "../services/appointments.service";
import { useToast } from "primevue/usetoast";
import type { CreateAppointmentPayload } from "../services/appointments.service";

const appointments = reactive({
  isLoadingMonthData: true,
  calendar: new Date(),
  monthData: [],
  isCreating: false,
});

const getMonthData = async (month: string) => {
  try {
    appointments.isLoadingMonthData = true;
    appointments.monthData = [];
    appointments.monthData = await appointmentsService.getMonthData(month);
  } catch (error) {
    console.error(error);
    appointments.monthData = [];
  } finally {
    appointments.isLoadingMonthData = false;
  }
};

const selectedDayAppointments = computed(() => {
  return appointments.monthData.filter(
    (appointment) =>
      Number(appointment.date.split("-")[2]) === appointments.calendar.getDate()
  );
});

const getInitialMonthData = async () => {
  const month = `${
    appointments.calendar.getMonth() + 1
  }-${appointments.calendar.getFullYear()}`;
  appointments.monthData = await appointmentsService.getMonthData(month);
};

const containDay = (day: number) => {
  return appointments.monthData.some(
    (appointment) => Number(appointment.date.split("-")[2]) === day
  );
};

export const useAppointments = () => {
  const toast = useToast();

  const createAppointment = async (payload: CreateAppointmentPayload) => {
    try {
      appointments.isCreating = true;
      await appointmentsService.create(payload);
      toast.add({
        severity: "success",
        summary: "Sucesso",
        detail: "Agendamento criado com sucesso",
        life: 3000,
      });
      getInitialMonthData();
    } catch (error) {
      console.error(error);
      toast.add({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao criar agendamento",
        life: 3000,
      });
    } finally {
      appointments.isCreating = false;
    }
  };

  const deleteAppointment = async (id: number) => {
    try {
      await appointmentsService.delete(id);
      toast.add({
        severity: "success",
        summary: "Sucesso",
        detail: "Agendamento deletado com sucesso",
        life: 3000,
      });
    } catch (error) {
      console.error(error);
      toast.add({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao deletar agendamento",
        life: 3000,
      });
    } finally {
      getInitialMonthData();
    }
  };

  return {
    ...toRefs(appointments),
    getMonthData,
    getInitialMonthData,
    containDay,
    selectedDayAppointments,
    deleteAppointment,
    createAppointment,
  };
};
