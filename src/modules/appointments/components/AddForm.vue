<script setup lang="ts">
import Button from "primevue/button";
import Select from "primevue/select";
import { ref, computed } from "vue";
import { useAppointments } from "../hooks/appointments.hook";
import { useCustomers } from "../../../modules/customers/hooks/customers.hook";

const { calendar, createAppointment, isCreating } = useAppointments();
const { customers, isLoading: isLoadingCustomers } = useCustomers();

const time = ref(null);
const times = ref(
  Array.from({ length: 14 }, (_, i) => ({
    name: `${i + 7}:00`,
    value: `${i + 7}:00`,
  }))
);

const customer = ref(null);

const isFormValid = computed(() => {
  return time.value && customer.value;
});

const handleSubmit = async () => {
  if (!isFormValid.value) return;

  const formattedDate = `${calendar.value.getFullYear()}-${
    calendar.value.getMonth() + 1
  }-${calendar.value.getDate()}`;

  await createAppointment({
    customerId: Number(customer.value.id),
    date: formattedDate,
    time: time.value.value,
  });

  // Reset form
  time.value = null;
  customer.value = null;
};
</script>
<template>
  <div class="flex flex-col gap-4">
    <Select
      v-model="time"
      :options="times"
      optionLabel="name"
      placeholder="Selecione o horário"
      :disabled="isCreating"
    />
    <Select
      v-model="customer"
      :options="customers"
      optionLabel="name"
      placeholder="Selecione o cliente"
      :disabled="isCreating || isLoadingCustomers"
      :loading="isLoadingCustomers"
    />
    <Button
      icon="pi pi-calendar-plus"
      :label="isCreating ? 'Agendando...' : 'Agendar'"
      :loading="isCreating"
      :disabled="!isFormValid || isCreating"
      @click="handleSubmit"
    />
  </div>
</template>
