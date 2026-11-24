<script setup lang="ts">
import Button from "primevue/button";
import { useConfirm } from "primevue/useconfirm";
import { useAppointments } from "../hooks/appointments.hook";
import type { Appointment } from "../services/appointments.service";

const { selectedDayAppointments, deleteAppointment, isLoadingMonthData } = useAppointments();
const confirm = useConfirm();

const confirmDelete = (appointment: Appointment) => {
  confirm.require({
    header: "Excluir agendamento",
    message: `Excluir o horário das ${appointment.time} de ${appointment.customer.name}?`,
    icon: "pi pi-exclamation-triangle",
    rejectProps: { label: "Cancelar", severity: "secondary", outlined: true },
    acceptProps: { label: "Excluir", severity: "danger" },
    accept: () => deleteAppointment(appointment.id),
  });
};
</script>
<template>
  <div class="grid gap-2">
    <ul v-if="selectedDayAppointments.length" class="grid gap-2">
      <li
        v-for="appointment in selectedDayAppointments"
        :key="appointment.id"
        class="flex items-center gap-4 pl-4 pr-1 py-1 bg-surface-50 border border-surface-200 rounded-xl"
      >
        <span class="text-lg font-semibold tabular-nums text-primary-800">
          {{ appointment.time }}
        </span>
        <RouterLink
          :to="{ name: 'counseling.customer', params: { id: appointment.customer.id } }"
          class="flex-1 font-medium py-3 hover:underline"
        >
          {{ appointment.customer.name }}
        </RouterLink>
        <Button
          icon="pi pi-trash"
          severity="danger"
          text
          rounded
          aria-label="Excluir agendamento"
          @click="confirmDelete(appointment)"
        />
      </li>
    </ul>
    <p v-else-if="!isLoadingMonthData" class="text-surface-500 py-6 text-center">
      Nenhum agendamento neste dia.
    </p>
  </div>
</template>
