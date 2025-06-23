<script setup lang="ts">
import Button from "primevue/button";
import { useAppointments } from "../hooks/appointments.hook";
import FeedBack from "@/components/FeedBack.vue";
import ConfirmPopup from "primevue/confirmpopup";
import { useConfirm } from "primevue/useconfirm";

const { selectedDayAppointments, deleteAppointment } = useAppointments();
const confirm = useConfirm();

const confirmDelete = (event: MouseEvent, id: number) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: "Tem certeza que deseja excluir este agendamento?",
    icon: "pi pi-info-circle",
    rejectProps: {
      label: "Cancelar",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Excluir",
      severity: "danger",
    },
    accept: () => {
      deleteAppointment(id);
    },
    reject: () => {},
  });
};
</script>
<template>
  <div class="flex flex-col gap-2 md:col-span-2 xl:col-span-1">
    <ConfirmPopup />
    <p class="text-sm font-bold">Horarios agendados:</p>
    <template v-if="selectedDayAppointments.length > 0">
      <div
        v-for="appointment in selectedDayAppointments"
        :key="appointment.time"
        class="flex gap-2 p-2 bg-gray-100 rounded-md items-center"
      >
        <p class="text-sm">{{ appointment.time }}</p>
        <p class="text-sm font-bold flex-1">
          {{ appointment.customer.name }}
        </p>
        <Button
          icon="pi pi-save"
          class="ml-auto"
          severity="danger"
          rounded
          title="Excluir agendamento"
          @click="(event) => confirmDelete(event, appointment.id)"
        />
      </div>
    </template>
    <template v-else>
      <FeedBack
        icon="folder"
        description="Nenhum agendamento encontrado para o dia selecionado"
      />
    </template>
  </div>
</template>
