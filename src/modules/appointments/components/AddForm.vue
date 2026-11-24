<script setup lang="ts">
import Button from "primevue/button";
import Select from "primevue/select";
import { ref, computed } from "vue";
import { useAppointments } from "../hooks/appointments.hook";
import { useCustomers } from "@/modules/customers/hooks/customers.hook";
import type { Customer } from "@/modules/customers/services/customers.types";

const { selectedDateAPI, selectedDayAppointments, createAppointment, isCreating } =
  useAppointments();
const { customers, isLoading: isLoadingCustomers } = useCustomers();

// Horários de 07:00 a 21:00, de 30 em 30 minutos.
const allTimes = Array.from({ length: 29 }, (_, i) => {
  const minutes = 7 * 60 + i * 30;
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${minutes % 60 ? "30" : "00"}`;
});

const times = computed(() => {
  const taken = new Set(selectedDayAppointments.value.map((a) => a.time));
  return allTimes.map((t) => ({ label: taken.has(t) ? `${t} (ocupado)` : t, value: t }));
});

const time = ref<string | null>(null);
const customer = ref<Customer | null>(null);

const isFormValid = computed(() => !!time.value && !!customer.value);

const handleSubmit = async () => {
  if (!isFormValid.value) return;
  const ok = await createAppointment({
    customerId: customer.value!.id,
    date: selectedDateAPI.value,
    time: time.value!,
  });
  if (ok) {
    time.value = null;
    customer.value = null;
  }
};
</script>
<template>
  <form class="grid gap-3" @submit.prevent="handleSubmit">
    <h3 class="section-title">Novo agendamento</h3>
    <div class="grid sm:grid-cols-[9rem_1fr] gap-3">
      <Select
        v-model="time"
        :options="times"
        optionLabel="label"
        optionValue="value"
        placeholder="Horário"
        :disabled="isCreating"
        scrollHeight="18rem"
        aria-label="Horário"
      />
      <Select
        v-model="customer"
        :options="customers"
        optionLabel="name"
        placeholder="Cliente"
        filter
        filterPlaceholder="Buscar cliente"
        emptyFilterMessage="Nenhum cliente encontrado"
        emptyMessage="Cadastre um cliente primeiro"
        :disabled="isCreating"
        :loading="isLoadingCustomers"
        scrollHeight="18rem"
        aria-label="Cliente"
      />
    </div>
    <Button
      type="submit"
      icon="pi pi-calendar-plus"
      label="Agendar"
      :loading="isCreating"
      :disabled="!isFormValid"
    />
  </form>
</template>
